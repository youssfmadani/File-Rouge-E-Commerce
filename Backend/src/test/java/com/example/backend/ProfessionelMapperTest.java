package com.example.backend;

import com.example.backend.dto.ProfessionelDTO;
import com.example.backend.entity.Professionel;
import com.example.backend.entity.Utilisateur;
import com.example.backend.mapper.ProfessionelMapper;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ProfessionelMapperTest {
    private final ProfessionelMapper mapper = Mappers.getMapper(ProfessionelMapper.class);

    @Test
    void testEntityToDTO() {
        // Given
        Professionel professionel = new Professionel();
        professionel.setId(1);
        professionel.setNom("Professionel");
        professionel.setPrénom("Expert"); // Note: entity uses prénom (with accent)
        professionel.setEmail("pro@example.com");

        // When
        ProfessionelDTO dto = mapper.toDTO(professionel);

        // Then
        assertNotNull(dto);
        assertEquals(1, dto.getId());
        assertEquals("Professionel", dto.getNom());
        assertEquals("Expert", dto.getPrenom()); // Note: DTO uses prenom (without accent)
        assertEquals("pro@example.com", dto.getEmail());
    }

    @Test
    void testDTOToEntity() {
        // Given
        ProfessionelDTO dto = new ProfessionelDTO();
        dto.setId(1);
        dto.setNom("Professionel");
        dto.setPrenom("Expert"); // Note: DTO uses prenom (without accent)
        dto.setEmail("pro@example.com");

        // When
        Professionel professionel = mapper.toEntity(dto);

        // Then
        assertNotNull(professionel);
        assertEquals(1, professionel.getId());
        assertEquals("Professionel", professionel.getNom());
        assertEquals("Expert", professionel.getPrénom()); // Note: entity uses prénom (with accent)
        assertEquals("pro@example.com", professionel.getEmail());
        // Ignored field should be null
        assertNull(professionel.getMotDePasse());
    }

    @Test
    void testNullSafety() {
        assertNull(mapper.toDTO(null));
        assertNull(mapper.toEntity(null));
    }

    @Test
    void testEntityListToDTOList() {
        // Given
        Professionel professionel1 = new Professionel();
        professionel1.setId(1);
        professionel1.setNom("Professionel");
        professionel1.setPrénom("Expert");
        professionel1.setEmail("pro1@example.com");

        Professionel professionel2 = new Professionel();
        professionel2.setId(2);
        professionel2.setNom("Specialist");
        professionel2.setPrénom("Master");
        professionel2.setEmail("pro2@example.com");

        List<Professionel> professionels = Arrays.asList(professionel1, professionel2);

        // When
        List<ProfessionelDTO> dtos = mapper.toDTOList(professionels);

        // Then
        assertNotNull(dtos);
        assertEquals(2, dtos.size());
        assertEquals(1, dtos.get(0).getId());
        assertEquals("Professionel", dtos.get(0).getNom());
        assertEquals("Expert", dtos.get(0).getPrenom());
        assertEquals("pro1@example.com", dtos.get(0).getEmail());
        assertEquals(2, dtos.get(1).getId());
        assertEquals("Specialist", dtos.get(1).getNom());
        assertEquals("Master", dtos.get(1).getPrenom());
        assertEquals("pro2@example.com", dtos.get(1).getEmail());
    }

    @Test
    void testDTOListToEntityList() {
        // Given
        ProfessionelDTO dto1 = new ProfessionelDTO();
        dto1.setId(1);
        dto1.setNom("Professionel");
        dto1.setPrenom("Expert");
        dto1.setEmail("pro1@example.com");

        ProfessionelDTO dto2 = new ProfessionelDTO();
        dto2.setId(2);
        dto2.setNom("Specialist");
        dto2.setPrenom("Master");
        dto2.setEmail("pro2@example.com");

        List<ProfessionelDTO> dtos = Arrays.asList(dto1, dto2);

        // When
        List<Professionel> professionels = mapper.toEntityList(dtos);

        // Then
        assertNotNull(professionels);
        assertEquals(2, professionels.size());
        assertEquals(1, professionels.get(0).getId());
        assertEquals("Professionel", professionels.get(0).getNom());
        assertEquals("Expert", professionels.get(0).getPrénom());
        assertEquals("pro1@example.com", professionels.get(0).getEmail());
        // Ignored field should be null
        assertNull(professionels.get(0).getMotDePasse());

        assertEquals(2, professionels.get(1).getId());
        assertEquals("Specialist", professionels.get(1).getNom());
        assertEquals("Master", professionels.get(1).getPrénom());
        assertEquals("pro2@example.com", professionels.get(1).getEmail());
        // Ignored field should be null
        assertNull(professionels.get(1).getMotDePasse());
    }
}