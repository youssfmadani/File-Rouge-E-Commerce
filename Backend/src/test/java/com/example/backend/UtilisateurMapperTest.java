package com.example.backend;

import com.example.backend.dto.UtilisateurDTO;
import com.example.backend.entity.Utilisateur;
import com.example.backend.mapper.UtilisateurMapper;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class UtilisateurMapperTest {
    private final UtilisateurMapper mapper = Mappers.getMapper(UtilisateurMapper.class);

    @Test
    void testEntityToDTO() {
        // Given
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setId(1);
        utilisateur.setNom("Doe");
        utilisateur.setPrénom("John"); // Note: entity uses prénom (with accent)
        utilisateur.setEmail("john.doe@example.com");

        // When
        UtilisateurDTO dto = mapper.toDTO(utilisateur);

        // Then
        assertNotNull(dto);
        assertEquals(1, dto.getId());
        assertEquals("Doe", dto.getNom());
        assertEquals("John", dto.getPrenom()); // Note: DTO uses prenom (without accent)
        assertEquals("john.doe@example.com", dto.getEmail());
    }

    @Test
    void testDTOToEntity() {
        // Given
        UtilisateurDTO dto = new UtilisateurDTO();
        dto.setId(1);
        dto.setNom("Doe");
        dto.setPrenom("John"); // Note: DTO uses prenom (without accent)
        dto.setEmail("john.doe@example.com");

        // When
        Utilisateur utilisateur = mapper.toEntity(dto);

        // Then
        assertNotNull(utilisateur);
        assertEquals(1, utilisateur.getId());
        assertEquals("Doe", utilisateur.getNom());
        assertEquals("John", utilisateur.getPrénom()); // Note: entity uses prénom (with accent)
        assertEquals("john.doe@example.com", utilisateur.getEmail());
    }

    @Test
    void testNullSafety() {
        assertNull(mapper.toDTO(null));
        assertNull(mapper.toEntity(null));
    }

    @Test
    void testEntityListToDTOList() {
        // Given
        Utilisateur utilisateur1 = new Utilisateur();
        utilisateur1.setId(1);
        utilisateur1.setNom("Doe");
        utilisateur1.setPrénom("John");
        utilisateur1.setEmail("john.doe@example.com");

        Utilisateur utilisateur2 = new Utilisateur();
        utilisateur2.setId(2);
        utilisateur2.setNom("Smith");
        utilisateur2.setPrénom("Jane");
        utilisateur2.setEmail("jane.smith@example.com");

        List<Utilisateur> utilisateurs = Arrays.asList(utilisateur1, utilisateur2);

        // When
        List<UtilisateurDTO> dtos = mapper.toDTOList(utilisateurs);

        // Then
        assertNotNull(dtos);
        assertEquals(2, dtos.size());
        assertEquals(1, dtos.get(0).getId());
        assertEquals("Doe", dtos.get(0).getNom());
        assertEquals("John", dtos.get(0).getPrenom());
        assertEquals("john.doe@example.com", dtos.get(0).getEmail());
        assertEquals(2, dtos.get(1).getId());
        assertEquals("Smith", dtos.get(1).getNom());
        assertEquals("Jane", dtos.get(1).getPrenom());
        assertEquals("jane.smith@example.com", dtos.get(1).getEmail());
    }

    @Test
    void testDTOListToEntityList() {
        // Given
        UtilisateurDTO dto1 = new UtilisateurDTO();
        dto1.setId(1);
        dto1.setNom("Doe");
        dto1.setPrenom("John");
        dto1.setEmail("john.doe@example.com");

        UtilisateurDTO dto2 = new UtilisateurDTO();
        dto2.setId(2);
        dto2.setNom("Smith");
        dto2.setPrenom("Jane");
        dto2.setEmail("jane.smith@example.com");

        List<UtilisateurDTO> dtos = Arrays.asList(dto1, dto2);

        // When
        List<Utilisateur> utilisateurs = mapper.toEntityList(dtos);

        // Then
        assertNotNull(utilisateurs);
        assertEquals(2, utilisateurs.size());
        assertEquals(1, utilisateurs.get(0).getId());
        assertEquals("Doe", utilisateurs.get(0).getNom());
        assertEquals("John", utilisateurs.get(0).getPrénom());
        assertEquals("john.doe@example.com", utilisateurs.get(0).getEmail());
        assertEquals(2, utilisateurs.get(1).getId());
        assertEquals("Smith", utilisateurs.get(1).getNom());
        assertEquals("Jane", utilisateurs.get(1).getPrénom());
        assertEquals("jane.smith@example.com", utilisateurs.get(1).getEmail());
    }
}