package website.makkakuh.service;

import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;
import javax.imageio.ImageIO;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import org.jboss.resteasy.reactive.multipart.FileUpload;

@ApplicationScoped
public class CDNService {

    private static final Logger LOG = Logger.getLogger(CDNService.class);
    private static final Pattern SAFE_FILENAME_PATTERN = Pattern.compile(
        "[^a-zA-Z0-9._-]"
    );
    private static final DateTimeFormatter TIMESTAMP_FORMAT =
        DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final Map<String, Integer> userUploadCounts =
        new ConcurrentHashMap<>();
    private final Map<String, Long> userLastResetTime =
        new ConcurrentHashMap<>();

    @Inject
    @ConfigProperty(name = "cdn.upload.directory", defaultValue = "uploads")
    public String uploadDirectory;

    @Inject
    @ConfigProperty(name = "cdn.upload.max-file-size", defaultValue = "5242880")
    long maxFileSize;

    @Inject
    @ConfigProperty(
        name = "cdn.upload.allowed-types",
        defaultValue = "image/jpeg,image/png,image/webp,image/gif"
    )
    List<String> allowedTypes;

    @Inject
    @ConfigProperty(name = "cdn.avatar.max-width", defaultValue = "500")
    int maxAvatarWidth;

    @Inject
    @ConfigProperty(name = "cdn.avatar.max-height", defaultValue = "500")
    int maxAvatarHeight;

    @Inject
    @ConfigProperty(name = "cdn.avatar.sizes", defaultValue = "60,120,200")
    List<Integer> avatarSizes;

    @Inject
    @ConfigProperty(name = "cdn.rate-limit.max-requests", defaultValue = "10")
    int maxRequestsPerWindow;

    @Inject
    @ConfigProperty(name = "cdn.rate-limit.window-seconds", defaultValue = "60")
    int rateLimitWindowSeconds;

    public void init() {
        try {
            createDirectoryIfNotExists(uploadDirectory);
            createDirectoryIfNotExists(uploadDirectory + "/avatars");
            createDirectoryIfNotExists(uploadDirectory + "/honors");
            createDirectoryIfNotExists(uploadDirectory + "/badges");
            createDirectoryIfNotExists(uploadDirectory + "/temp");
            LOG.info("CDN directories initialized successfully");
        } catch (IOException e) {
            LOG.error("Failed to initialize CDN directories", e);
        }
    }

    private void createDirectoryIfNotExists(String directoryPath)
        throws IOException {
        Path path = Paths.get(directoryPath);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
            LOG.info("Created directory: " + directoryPath);
        }
    }

    public String uploadFile(FileUpload upload, String type, String userId)
        throws IOException {
        checkRateLimit(userId);

        String contentType = upload.contentType();
        if (!allowedTypes.contains(contentType)) {
            throw new WebApplicationException(
                "Tipo de arquivo não permitido. Tipos permitidos: " +
                    String.join(", ", allowedTypes),
                Response.Status.BAD_REQUEST
            );
        }

        if (upload.size() > maxFileSize) {
            throw new WebApplicationException(
                "Arquivo muito grande. Tamanho máximo: " +
                    maxFileSize / (1024 * 1024) +
                    "MB",
                Response.Status.BAD_REQUEST
            );
        }

        String subDir;
        if ("avatar".equalsIgnoreCase(type)) {
            subDir = "avatars";
        } else if ("honor".equalsIgnoreCase(type)) {
            subDir = "honors";
        } else {
            throw new WebApplicationException(
                "Tipo de arquivo inválido. Use 'avatar' ou 'honor'",
                Response.Status.BAD_REQUEST
            );
        }

        String originalFilename = upload.fileName();
        String extension = getExtension(originalFilename);
        if (extension.isEmpty()) {
            extension = getExtensionFromMimeType(contentType);
        }

        String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMAT);
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        String safeFileName = timestamp + "_" + uuid + "." + extension;

        Path targetPath = Paths.get(uploadDirectory, subDir, safeFileName);

        if ("avatar".equalsIgnoreCase(type)) {
            processAvatarImage(
                upload.uploadedFile(),
                targetPath.toString(),
                extension
            );
            for (int size : avatarSizes) {
                resizeImage(
                    targetPath.toString(),
                    Paths.get(
                        uploadDirectory,
                        subDir,
                        size + "_" + safeFileName
                    ).toString(),
                    size,
                    size,
                    extension
                );
            }
        } else {
            optimizeImage(
                upload.uploadedFile(),
                targetPath.toString(),
                extension
            );
        }

        return safeFileName;
    }

    public String downloadImageFromUrl(
        String imageUrl,
        String type,
        String userId
    ) throws IOException {
        checkRateLimit(userId);

        if (imageUrl == null || imageUrl.isEmpty()) {
            throw new WebApplicationException(
                "URL da imagem é obrigatória",
                Response.Status.BAD_REQUEST
            );
        }

        String subDir;
        if ("avatar".equalsIgnoreCase(type)) {
            subDir = "avatars";
        } else if ("honor".equalsIgnoreCase(type)) {
            subDir = "honors";
        } else {
            throw new WebApplicationException(
                "Tipo de arquivo inválido. Use 'avatar' ou 'honor'",
                Response.Status.BAD_REQUEST
            );
        }

        URL url = new URL(imageUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setConnectTimeout(5000);
        connection.setReadTimeout(5000);
        connection.setRequestProperty("User-Agent", "Makkakuh-CDN-Service/1.0");

        int responseCode = connection.getResponseCode();
        if (responseCode != HttpURLConnection.HTTP_OK) {
            throw new WebApplicationException(
                "Falha ao baixar imagem da URL. Código de resposta: " +
                    responseCode,
                Response.Status.BAD_REQUEST
            );
        }

        String contentType = connection.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new WebApplicationException(
                "Tipo de arquivo não permitido. Tipos permitidos: " +
                    String.join(", ", allowedTypes),
                Response.Status.BAD_REQUEST
            );
        }

        int contentLength = connection.getContentLength();
        if (contentLength > maxFileSize) {
            throw new WebApplicationException(
                "Arquivo muito grande. Tamanho máximo: " +
                    maxFileSize / (1024 * 1024) +
                    "MB",
                Response.Status.BAD_REQUEST
            );
        }

        String extension = getExtensionFromMimeType(contentType);

        String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMAT);
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        String safeFileName = timestamp + "_" + uuid + "." + extension;

        Path targetPath = Paths.get(uploadDirectory, subDir, safeFileName);

        try (InputStream inputStream = connection.getInputStream()) {
            BufferedImage originalImage = ImageIO.read(inputStream);

            if (originalImage == null) {
                throw new WebApplicationException(
                    "Não foi possível ler a imagem da URL fornecida",
                    Response.Status.BAD_REQUEST
                );
            }

            if ("avatar".equalsIgnoreCase(type)) {
                if (
                    originalImage.getWidth() > maxAvatarWidth ||
                    originalImage.getHeight() > maxAvatarHeight
                ) {
                    BufferedImage resizedImage = resizeImageProportionally(
                        originalImage,
                        maxAvatarWidth,
                        maxAvatarHeight
                    );
                    saveImage(resizedImage, targetPath.toString(), extension);
                } else {
                    saveImage(originalImage, targetPath.toString(), extension);
                }

                for (int size : avatarSizes) {
                    resizeImage(
                        targetPath.toString(),
                        Paths.get(
                            uploadDirectory,
                            subDir,
                            size + "_" + safeFileName
                        ).toString(),
                        size,
                        size,
                        extension
                    );
                }
            } else {
                saveImage(originalImage, targetPath.toString(), extension);
            }
        }

        return safeFileName;
    }

    private void processAvatarImage(
        Path sourcePath,
        String targetPath,
        String extension
    ) throws IOException {
        BufferedImage originalImage = ImageIO.read(sourcePath.toFile());

        if (
            originalImage.getWidth() > maxAvatarWidth ||
            originalImage.getHeight() > maxAvatarHeight
        ) {
            BufferedImage resizedImage = resizeImageProportionally(
                originalImage,
                maxAvatarWidth,
                maxAvatarHeight
            );
            saveImage(resizedImage, targetPath, extension);
        } else {
            Files.copy(
                sourcePath,
                Paths.get(targetPath),
                StandardCopyOption.REPLACE_EXISTING
            );
        }
    }

    private void optimizeImage(
        Path sourcePath,
        String targetPath,
        String extension
    ) throws IOException {
        BufferedImage originalImage = ImageIO.read(sourcePath.toFile());

        saveImage(originalImage, targetPath, extension);
    }

    private void resizeImage(
        String sourcePath,
        String targetPath,
        int width,
        int height,
        String extension
    ) throws IOException {
        BufferedImage originalImage = ImageIO.read(new File(sourcePath));
        BufferedImage resizedImage = new BufferedImage(
            width,
            height,
            originalImage.getType()
        );

        Graphics2D g = resizedImage.createGraphics();
        g.setRenderingHint(
            RenderingHints.KEY_INTERPOLATION,
            RenderingHints.VALUE_INTERPOLATION_BILINEAR
        );
        g.drawImage(originalImage, 0, 0, width, height, null);
        g.dispose();

        saveImage(resizedImage, targetPath, extension);
    }

    private BufferedImage resizeImageProportionally(
        BufferedImage original,
        int maxWidth,
        int maxHeight
    ) {
        int originalWidth = original.getWidth();
        int originalHeight = original.getHeight();

        float ratio = Math.min(
            (float) maxWidth / originalWidth,
            (float) maxHeight / originalHeight
        );

        int newWidth = Math.round(originalWidth * ratio);
        int newHeight = Math.round(originalHeight * ratio);

        BufferedImage resized = new BufferedImage(
            newWidth,
            newHeight,
            original.getType()
        );
        Graphics2D g = resized.createGraphics();
        g.setRenderingHint(
            RenderingHints.KEY_INTERPOLATION,
            RenderingHints.VALUE_INTERPOLATION_BILINEAR
        );
        g.drawImage(original, 0, 0, newWidth, newHeight, null);
        g.dispose();

        return resized;
    }

    private void saveImage(BufferedImage image, String path, String extension)
        throws IOException {
        File output = new File(path);
        ImageIO.write(image, extension.toLowerCase(), output);
    }

    public Path getFilePath(String filename, String type) {
        if (
            filename == null ||
            filename.isEmpty() ||
            filename.contains("..") ||
            filename.contains("/")
        ) {
            throw new WebApplicationException(
                "Nome de arquivo inválido",
                Response.Status.BAD_REQUEST
            );
        }

        String subDir;
        if ("avatar".equalsIgnoreCase(type)) {
            subDir = "avatars";
        } else if ("honor".equalsIgnoreCase(type)) {
            subDir = "honors";
        } else {
            throw new WebApplicationException(
                "Tipo de arquivo inválido. Use 'avatar' ou 'honor'",
                Response.Status.BAD_REQUEST
            );
        }

        Path filePath = Paths.get(uploadDirectory, subDir, filename);

        if (!Files.exists(filePath)) {
            throw new WebApplicationException(
                "Arquivo não encontrado",
                Response.Status.NOT_FOUND
            );
        }

        return filePath;
    }

    public void deleteFile(String filename, String type) throws IOException {
        Path filePath = getFilePath(filename, type);

        Files.delete(filePath);

        if ("avatar".equalsIgnoreCase(type)) {
            for (int size : avatarSizes) {
                Path sizedPath = Paths.get(
                    uploadDirectory,
                    "avatars",
                    size + "_" + filename
                );
                if (Files.exists(sizedPath)) {
                    Files.delete(sizedPath);
                }
            }
        }
    }

    @Scheduled(cron = "0 0 * * * ?") // A cada hora
    void cleanupTempFiles() {
        try {
            Path tempDir = Paths.get(uploadDirectory, "temp");
            if (Files.exists(tempDir)) {
                Files.list(tempDir)
                    .filter(Files::isRegularFile)
                    .filter(p -> {
                        try {
                            return (
                                Files.getLastModifiedTime(p).toMillis() <
                                System.currentTimeMillis() -
                                (24 * 60 * 60 * 1000)
                            ); // 24 horas
                        } catch (IOException e) {
                            return false;
                        }
                    })
                    .forEach(p -> {
                        try {
                            Files.delete(p);
                            LOG.info("Deleted temp file: " + p);
                        } catch (IOException e) {
                            LOG.warn("Failed to delete temp file: " + p, e);
                        }
                    });
            }
        } catch (IOException e) {
            LOG.error("Error cleaning up temp files", e);
        }
    }

    private void checkRateLimit(String userId) {
        long currentTime = System.currentTimeMillis() / 1000;

        userLastResetTime.computeIfPresent(userId, (id, lastReset) -> {
            if (currentTime - lastReset > rateLimitWindowSeconds) {
                userUploadCounts.put(id, 0);
                return currentTime;
            }
            return lastReset;
        });

        userLastResetTime.putIfAbsent(userId, currentTime);
        userUploadCounts.putIfAbsent(userId, 0);

        int currentCount = userUploadCounts.get(userId);
        if (currentCount >= maxRequestsPerWindow) {
            throw new WebApplicationException(
                "Limite de uploads excedido. Tente novamente mais tarde.",
                Response.Status.TOO_MANY_REQUESTS
            );
        }

        userUploadCounts.put(userId, currentCount + 1);
    }

    public String renameAvatarFile(String oldFilename, String newUserId)
        throws IOException {
        if (oldFilename == null || oldFilename.isEmpty()) {
            throw new IllegalArgumentException(
                "Old filename cannot be null or empty"
            );
        }

        String extension = getExtension(oldFilename);
        if (extension.isEmpty()) {
            extension = "jpg";
        }

        String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMAT);
        String newFilename = timestamp + "_" + newUserId + "." + extension;

        Path oldPath = Paths.get(uploadDirectory, "avatars", oldFilename);
        Path newPath = Paths.get(uploadDirectory, "avatars", newFilename);

        if (!Files.exists(oldPath)) {
            throw new IOException(
                "Original avatar file not found: " + oldFilename
            );
        }

        Files.move(oldPath, newPath, StandardCopyOption.REPLACE_EXISTING);

        for (int size : avatarSizes) {
            Path oldSizedPath = Paths.get(
                uploadDirectory,
                "avatars",
                size + "_" + oldFilename
            );
            Path newSizedPath = Paths.get(
                uploadDirectory,
                "avatars",
                size + "_" + newFilename
            );

            if (Files.exists(oldSizedPath)) {
                Files.move(
                    oldSizedPath,
                    newSizedPath,
                    StandardCopyOption.REPLACE_EXISTING
                );
            }
        }

        return newFilename;
    }

    private String getExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }

        int lastDotPosition = filename.lastIndexOf('.');
        if (lastDotPosition == -1 || lastDotPosition == filename.length() - 1) {
            return "";
        }

        return filename.substring(lastDotPosition + 1).toLowerCase();
    }

    private String getExtensionFromMimeType(String mimeType) {
        switch (mimeType) {
            case "image/jpeg":
                return "jpg";
            case "image/png":
                return "png";
            case "image/webp":
                return "webp";
            case "image/gif":
                return "gif";
            default:
                return "bin";
        }
    }
}
