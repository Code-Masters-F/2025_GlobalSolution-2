package com.focuswave.resources;

import com.focuswave.dto.MusicSuggestionDTO;
import com.focuswave.dao.MusicDAO;
import com.focuswave.model.Music;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.stream.Collectors;

@Path("/musics")
public class MusicResource {

    private final MusicDAO musicDAO = new MusicDAO();

    /**
     * Retorna todas as músicas disponíveis.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllMusics() {
        List<Music> musics = musicDAO.findAll();

        List<MusicSuggestionDTO> dtos = musics.stream()
                .map(m -> new MusicSuggestionDTO(
                        m.getId(),
                        m.getTitle(),
                        m.getDescription(),
                        m.getUrl(),
                        m.getCategory()
                ))
                .collect(Collectors.toList());

        return Response.ok(dtos).build();
    }

    /**
     * Retorna uma música específica por ID.
     */
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMusicById(@PathParam("id") int id) {
        Music music = musicDAO.findById(id);

        if (music == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Música não encontrada.")
                    .build();
        }

        MusicSuggestionDTO dto = new MusicSuggestionDTO(
                music.getId(),
                music.getTitle(),
                music.getDescription(),
                music.getUrl(),
                music.getCategory()
        );

        return Response.ok(dto).build();
    }
}
