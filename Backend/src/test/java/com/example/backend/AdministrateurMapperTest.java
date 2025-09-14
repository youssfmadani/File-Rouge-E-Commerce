package com.example.backend;

import com.example.backend.dto.AdministrateurDTO;
import com.example.backend.entity.Administrateur;
import com.example.backend.entity.Utilisateur;
import com.example.backend.mapper.AdministrateurMapper;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class AdministrateurMapperTest {
    private final AdministrateurMapper mapper = Mappers.getMapper(AdministrateurMapper.class);

    @Test
    void testEntityToDTO() {
        // Given
        Administrateur administrateur = new Administrateur();
        administrateur.setId(1);
        administrateur.setNom("Admin");
        administrateur.setPrénom("Super"); // Note: entity uses prénom (with accent)
        administrateur.setEmail("admin@example.com");

        // When
        AdministrateurDTO dto = mapper.toDTO(administrateur);

        // Then
        assertNotNull(dto);
        assertEquals(1, dto.getId());
        assertEquals("Admin", dto.getNom());
        assertEquals("Super", dto.getPrenom()); // Note: DTO uses prenom (without accent)
        assertEquals("admin@example.com", dto.getEmail());
    }

    @Test
    void testDTOToEntity() {
        // Given
        AdministrateurDTO dto = new AdministrateurDTO();
        dto.setId(1);
        dto.setNom("Admin");
        dto.setPrenom("Super"); // Note: DTO uses prenom (without accent)
        dto.setEmail("admin@example.com");

        // When
        Administrateur administrateur = mapper.toEntity(dto);

        // Then
        assertNotNull(administrateur);
        assertEquals(1, administrateur.getId());
        assertEquals("Admin", administrateur.getNom());
        assertEquals("Super", administrateur.getPrénom()); // Note: entity uses prénom (with accent)
        assertEquals("admin@example.com", administrateur.getEmail());
        // Ignored field should be null
        assertNull(administrateur.getMotDePasse());
    }

    @Test
    void testNullSafety() {
        assertNull(mapper.toDTO(null));
        assertNull(mapper.toEntity(null));
    }

    @Test
    void testEntityListToDTOList() {
        // Given
        Administrateur administrateur1 = new Administrateur();
        administrateur1.setId(1);
        administrateur1.setNom("Admin");
        administrateur1.setPrénom("Super");
        administrateur1.setEmail("admin@example.com");

        Administrateur administrateur2 = new Administrateur();
        administrateur2.setId(2);
        administrateur2.setNom("Moderator");
        administrateur2.setPrénom("Chief");
        administrateur2.setEmail("moderator@example.com");

        List<Administrateur> administrateurs = Arrays.asList(administrateur1, administrateur2);

        // When
        List<AdministrateurDTO> dtos = mapper.toDTOList(administrateurs);

        // Then
        assertNotNull(dtos);
        assertEquals(2, dtos.size());
        assertEquals(1, dtos.get(0).getId());
        assertEquals("Admin", dtos.get(0).getNom());
        assertEquals("Super", dtos.get(0).getPrenom());
        assertEquals("admin@example.com", dtos.get(0).getEmail());
        assertEquals(2, dtos.get(1).getId());
        assertEquals("Moderator", dtos.get(1).getNom());
        assertEquals("Chief", dtos.get(1).getPrenom());
        assertEquals("moderator@example.com", dtos.get(1).getEmail());
    }

    @Test
    void testDTOListToEntityList() {
        // Given
        AdministrateurDTO dto1 = new AdministrateurDTO();
        dto1.setId(1);
        dto1.setNom("Admin");
        dto1.setPrenom("Super");
        dto1.setEmail("admin@example.com");

        AdministrateurDTO dto2 = new AdministrateurDTO();
        dto2.setId(2);
        dto2.setNom("Moderator");
        dto2.setPrenom("Chief");
        dto2.setEmail("moderator@example.com");

        List<AdministrateurDTO> dtos = Arrays.asList(dto1, dto2);

        // When
        List<Administrateur> administrateurs = mapper.toEntityList(dtos);

        // Then
        assertNotNull(administrateurs);
        assertEquals(2, administrateurs.size());
        assertEquals(1, administrateurs.get(0).getId());
        assertEquals("Admin", administrateurs.get(0).getNom());
        assertEquals("Super", administrateurs.get(0).getPrénom());
        assertEquals("admin@example.com", administrateurs.get(0).getEmail());
        // Ignored field should be null
        assertNull(administrateurs.get(0).getMotDePasse());

        assertEquals(2, administrateurs.get(1).getId());
        assertEquals("Moderator", administrateurs.get(1).getNom());
        assertEquals("Chief", administrateurs.get(1).getPrénom());
        assertEquals("moderator@example.com", administrateurs.get(1).getEmail());
        // Ignored field should be null
        assertNull(administrateurs.get(1).getMotDePasse());
    }
}