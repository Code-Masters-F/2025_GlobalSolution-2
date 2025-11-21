package com.focuswave.resources;

import com.focuswave.dto.ChatRequestDTO;
import com.focuswave.dto.MusicSuggestionDTO;
import com.focuswave.service.ChatService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/chat")
public class ChatResource {

    private final ChatService chatService = new ChatService();

    @POST
    @Path("/suggestions")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSuggestions(ChatRequestDTO requestDTO) {

        if (requestDTO == null || requestDTO.getGoal() == null || requestDTO.getGoal().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("O campo 'goal' é obrigatório.")
                    .build();
        }

        String goal = requestDTO.getGoal();
        Integer lastMusicId = requestDTO.getLastMusicId();

        List<MusicSuggestionDTO> suggestions = chatService.getSuggestions(goal, lastMusicId);

        return Response.ok(suggestions).build();
    }
}
