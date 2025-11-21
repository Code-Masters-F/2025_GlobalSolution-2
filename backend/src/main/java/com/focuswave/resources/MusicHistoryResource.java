package com.focuswave.resources;

import com.focuswave.dto.HistoryRegisterDTO;
import com.focuswave.dto.MusicHistoryDTO;
import com.focuswave.service.HistoryService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/history")
public class MusicHistoryResource {

    private final HistoryService historyService = new HistoryService();

    /**
     * Registra que um usuário tocou uma música.
     */
    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response registerPlay(HistoryRegisterDTO dto) {
        if (dto == null || dto.getIdUser() <= 0 || dto.getIdMusic() <= 0) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Campos userId e musicId são obrigatórios.")
                    .build();
        }

        boolean ok = historyService.registerPlay(dto.getIdUser(), dto.getIdMusic());

        if (!ok) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Música não encontrada ou erro ao registrar.")
                    .build();
        }

        return Response.ok("{\"message\": \"Registrado com sucesso\"}").build();
    }

    /**
     * Listar músicas recentes tocadas pelo usuário.
     */
    @GET
    @Path("/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRecentHistory(
            @PathParam("userId") int userId,
            @QueryParam("limit") @DefaultValue("10") int limit) {

        if (userId <= 0) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("userId inválido.")
                    .build();
        }

        List<MusicHistoryDTO> history = historyService.getRecentHistory(userId, limit);

        return Response.ok(history).build();
    }
}
