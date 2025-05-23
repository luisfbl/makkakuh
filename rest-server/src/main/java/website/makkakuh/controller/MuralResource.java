package website.makkakuh.controller;

import io.quarkus.panache.common.Page;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import website.makkakuh.model.Honor;
import website.makkakuh.model.User;
import website.makkakuh.model.UserDetail;
import website.makkakuh.model.UserHonor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Path("/api/mural")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MuralResource {

    @GET
    public Response getMuralData(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size) {

        Map<String, Object> response = new HashMap<>();

        try {
            List<User> paginatedUsers = User.findAll()
                    .page(Page.of(page, size))
                    .list();

            long totalUsers = User.count();
            int totalPages = (int) Math.ceil((double) totalUsers / size);

            if (paginatedUsers.isEmpty()) {
                response.put("profiles", List.of());
                response.put("honors", Honor.listAll());
                response.put("pagination", Map.of(
                        "page", page,
                        "size", size,
                        "totalItems", totalUsers,
                        "totalPages", totalPages
                ));
                return Response.ok(response).build();
            }

            List<Long> userIds = paginatedUsers.stream()
                    .map(u -> u.id)
                    .collect(Collectors.toList());

            List<UserDetail> userDetails = UserDetail.find("user.id in ?1", userIds).list();
            List<UserHonor> userHonors = UserHonor.find("user.id in ?1", userIds).list();

            List<Map<String, Object>> profiles = buildUserProfiles(
                    paginatedUsers, userDetails, userHonors);

            List<Honor> honors = Honor.listAll();
            List<Map<String, Object>> honorsMapList = buildHonorsMap(honors);

            response.put("profiles", profiles);
            response.put("honors", honorsMapList);
            response.put("pagination", Map.of(
                    "page", page,
                    "size", size,
                    "totalItems", totalUsers,
                    "totalPages", totalPages
            ));

            return Response.ok(response).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError()
                    .entity(Map.of("error", "Falha ao buscar dados do mural: " + e.getMessage()))
                    .build();
        }
    }

    private List<Map<String, Object>> buildUserProfiles(
            List<User> users,
            List<UserDetail> userDetails,
            List<UserHonor> userHonors) {

        List<Map<String, Object>> profiles = new ArrayList<>();

        for (User user : users) {
            Map<String, Object> profile = new HashMap<>();

            // Monta dados do usuário
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.id);
            userMap.put("name", user.name);
            userMap.put("nickname", user.nickname);
            userMap.put("pictureUrl", user.pictureUrl);
            userMap.put("avatarFilename", user.avatarFilename);
            userMap.put("bio", user.bio);

            profile.put("user", userMap);

            // Busca detalhes do usuário
            UserDetail userDetail = userDetails.stream()
                    .filter(ud -> ud.user.id.equals(user.id))
                    .findFirst()
                    .orElse(null);

            if (userDetail != null) {
                Map<String, Object> userDetailMap = new HashMap<>();
                userDetailMap.put("id", userDetail.id);
                userDetailMap.put("patent", userDetail.patent);
                userDetailMap.put("dan", userDetail.dan);
                userDetailMap.put("battleStarAmount", userDetail.battleStarAmount);
                userDetailMap.put("statusStarAmount", userDetail.statusStarAmount);
                profile.put("userDetail", userDetailMap);
            } else {
                // Cria detalhes padrão se não existir
                Map<String, Object> defaultDetail = new HashMap<>();
                defaultDetail.put("id", null);
                defaultDetail.put("patent", "Novato");
                defaultDetail.put("dan", 0);
                defaultDetail.put("battleStarAmount", 0);
                defaultDetail.put("statusStarAmount", 0);
                profile.put("userDetail", defaultDetail);
            }

            // Busca honrarias do usuário
            List<Map<String, Object>> userHonorMaps = userHonors.stream()
                    .filter(uh -> uh.user.id.equals(user.id))
                    .map(this::buildUserHonorMap)
                    .collect(Collectors.toList());

            profile.put("honors", userHonorMaps);
            profiles.add(profile);
        }

        return profiles;
    }

    private List<Map<String, Object>> buildHonorsMap(List<Honor> honors) {
        return honors.stream().map(honor -> {
            Map<String, Object> honorMap = new HashMap<>();
            honorMap.put("id", honor.id);
            honorMap.put("name", honor.name);
            honorMap.put("icon", honor.icon);
            return honorMap;
        }).collect(Collectors.toList());
    }

    private Map<String, Object> buildUserHonorMap(UserHonor userHonor) {
        Map<String, Object> userHonorMap = new HashMap<>();
        userHonorMap.put("id", userHonor.id);
        userHonorMap.put("userId", userHonor.user.id);
        userHonorMap.put("honorId", userHonor.honor.id);

        // Cria um mapa simplificado para a honraria
        Map<String, Object> honorMap = new HashMap<>();
        honorMap.put("id", userHonor.honor.id);
        honorMap.put("name", userHonor.honor.name);
        honorMap.put("icon", userHonor.honor.icon);

        userHonorMap.put("honor", honorMap);
        return userHonorMap;
    }
}