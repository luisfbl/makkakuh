package website.makkakuh.service;

import io.quarkus.oidc.client.OidcClient;
import io.smallrye.mutiny.Uni;
import website.makkakuh.model.UserProfile;

public interface OAuthProviderService {

    String getProviderName();

    OidcClient getClient();

    Uni<UserProfile> processTokenResponse(String code, String redirectUri, String codeVerifier);

    String getAuthorizationUrl(String redirectUri, String state, String codeChallenge);
}