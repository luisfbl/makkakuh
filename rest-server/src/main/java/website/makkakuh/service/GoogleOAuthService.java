package website.makkakuh.service;

import io.quarkus.oidc.client.OidcClient;
import io.quarkus.oidc.client.OidcClients;
import io.smallrye.mutiny.Uni;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import website.makkakuh.model.UserProfile;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class GoogleOAuthService implements OAuthProviderService {

    private static final Logger LOG = Logger.getLogger(GoogleOAuthService.class);

    @Inject
    OidcClients clients;

    @ConfigProperty(name = "quarkus.oidc-client.google.client-id")
    String clientId;

    @Override
    public String getProviderName() {
        return "google";
    }

    @Override
    public OidcClient getClient() {
        return clients.getClient("google");
    }

    @Override
    public Uni<UserProfile> processTokenResponse(String code, String redirectUri, String codeVerifier) {
        Map<String, String> params = new HashMap<>();
        params.put("code", code);
        params.put("redirect_uri", redirectUri);
        params.put("code_verifier", codeVerifier);

        return getClient().getTokens(params)
                .onItem().transform(tokens -> {
                    try {
                        String idToken = tokens.get("id_token");
                        UserProfile userProfile = new UserProfile();

                        if (idToken != null) {
                            String[] parts = idToken.split("\\.");
                            if (parts.length >= 2) {
                                String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
                                JsonObject claims = new JsonObject(payload);

                                userProfile.setId(claims.getString("sub"));
                                userProfile.setEmail(claims.getString("email", null));
                                userProfile.setName(claims.getString("name", null));
                                userProfile.setPictureUrl(claims.getString("picture", null));
                                userProfile.setLocale(claims.getString("locale", null));
                                userProfile.setProvider(getProviderName());
                            }
                        }

                        return userProfile;
                    } catch (Exception e) {
                        LOG.error("Error processing Google OAuth token", e);
                        throw new RuntimeException("Failed to process authentication", e);
                    }
                });
    }

    @Override
    public String getAuthorizationUrl(String redirectUri, String state, String codeChallenge) {
        try {
            String authUrlBase = "https://accounts.google.com/o/oauth2/v2/auth";
            String scopes = "openid profile email";

            return authUrlBase + "?" +
                    "client_id=" + clientId + "&" +
                    "response_type=code&" +
                    "scope=" + OAuthService.encodeUrl(scopes) + "&" +
                    "redirect_uri=" + OAuthService.encodeUrl(redirectUri) + "&" +
                    "state=" + state + "&" +
                    "code_challenge_method=S256&" +
                    "code_challenge=" + codeChallenge;
        } catch (Exception e) {
            LOG.error("Error generating Google authorization URL", e);
            throw new RuntimeException("Failed to generate authorization URL", e);
        }
    }
}