package website.makkakuh.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.jboss.logging.Logger;

/**
 * Utility class for signing and verifying session cookies using HMAC-SHA256
 */
public class SessionSigningUtil {

    private static final Logger LOG = Logger.getLogger(SessionSigningUtil.class);
    private static final String HMAC_ALGORITHM = "HmacSHA256";

    private SessionSigningUtil() {
        // Utility class, no instantiation
    }

    /**
     * Computes HMAC signature for the given data using the provided secret
     *
     * @param data The data to sign
     * @param secret The secret key
     * @return Base64 URL-encoded HMAC signature
     */
    public static String computeHmac(String data, String secret) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(
                secret.getBytes(StandardCharsets.UTF_8),
                HMAC_ALGORITHM
            );
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(keySpec);
            byte[] hmacBytes = mac.doFinal(
                data.getBytes(StandardCharsets.UTF_8)
            );
            return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(hmacBytes);
        } catch (Exception e) {
            LOG.error("Error computing HMAC", e);
            throw new RuntimeException("Failed to compute HMAC", e);
        }
    }

    /**
     * Creates a signed value with expiry time and HMAC signature
     * Format: value|expiryTime|signature
     *
     * @param value The value to sign
     * @param expirySeconds Expiry time in seconds from now
     * @param secret The secret key
     * @return Signed value string
     */
    public static String createSignedValue(String value, long expirySeconds, String secret) {
        long expiryTime = System.currentTimeMillis() + (expirySeconds * 1000);
        String payload = value + "|" + expiryTime;
        String signature = computeHmac(payload, secret);
        return payload + "|" + signature;
    }

    /**
     * Extracts and validates a signed value
     *
     * @param signedValue The signed value string
     * @param secret The secret key
     * @return The original value if valid, null if invalid or expired
     */
    public static String extractSignedValue(String signedValue, String secret) {
        try {
            String[] parts = signedValue.split("\\|", 3);
            if (parts.length != 3) {
                LOG.warn("Invalid signed value format");
                return null;
            }

            String value = parts[0];
            long expiryTime = Long.parseLong(parts[1]);
            String signature = parts[2];

            // Check expiry
            if (System.currentTimeMillis() > expiryTime) {
                LOG.debug("Signed value has expired");
                return null;
            }

            // Verify signature
            String payload = value + "|" + expiryTime;
            String computedSignature = computeHmac(payload, secret);

            if (!computedSignature.equals(signature)) {
                LOG.warn("Invalid signature for signed value");
                return null;
            }

            return value;
        } catch (Exception e) {
            LOG.error("Error extracting signed value", e);
            return null;
        }
    }

    /**
     * Gets the expiry time from a signed value without validating it
     * Useful for checking if refresh is needed
     *
     * @param signedValue The signed value string
     * @return Expiry time in milliseconds, or -1 if invalid format
     */
    public static long getExpiryTime(String signedValue) {
        try {
            String[] parts = signedValue.split("\\|", 3);
            if (parts.length != 3) {
                return -1;
            }
            return Long.parseLong(parts[1]);
        } catch (Exception e) {
            return -1;
        }
    }
}
