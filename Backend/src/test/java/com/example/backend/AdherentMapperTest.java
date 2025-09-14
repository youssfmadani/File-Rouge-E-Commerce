package com.example.backend;

import com.example.backend.dto.AdherentDTO;
import com.example.backend.entity.Adherent;
import com.example.backend.entity.Panier;
import com.example.backend.entity.Utilisateur;
import com.example.backend.mapper.AdherentMapper;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class AdherentMapperTest {
    private final AdherentMapper mapper = Mappers.getMapper(AdherentMapper.class);

    @Test
    void testEntityToDTO() {
        // Given
        Adherent adherent = new Adherent();
        adherent.setId(1);
        adherent.setNom("Doe");
        adherent.setPrénom("John"); // Note: entity uses prénom (with accent)
        adherent.setEmail("john.doe@example.com");

        // When
        AdherentDTO dto = mapper.toDTO(adherent);

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
        AdherentDTO dto = new AdherentDTO();
        dto.setId(1);
        dto.setNom("Doe");
        dto.setPrenom("John"); // Note: DTO uses prenom (without accent)
        dto.setEmail("john.doe@example.com");

        // When
        Adherent adherent = mapper.toEntity(dto);

        // Then
        assertNotNull(adherent);
        assertEquals(1, adherent.getId());
        assertEquals("Doe", adherent.getNom());
        assertEquals("John", adherent.getPrénom()); // Note: entity uses prénom (with accent)
        assertEquals("john.doe@example.com", adherent.getEmail());
        // Ignored fields should be null
        assertNull(adherent.getPanier());
        assertNull(adherent.getCommandes());
        assertNull(adherent.getAvis());
        assertNull(adherent.getMotDePasse());
    }

    @Test
    void testNullSafety() {
        assertNull(mapper.toDTO(null));
        assertNull(mapper.toEntity(null));
    }

    @Test
    void testEntityListToDTOList() {
        // Given
        Adherent adherent1 = new Adherent();
        adherent1.setId(1);
        adherent1.setNom("Doe");
        adherent1.setPrénom("John");
        adherent1.setEmail("john.doe@example.com");

        Adherent adherent2 = new Adherent();
        adherent2.setId(2);
        adherent2.setNom("Smith");
        adherent2.setPrénom("Jane");
        adherent2.setEmail("jane.smith@example.com");

        List<Adherent> adherents = Arrays.asList(adherent1, adherent2);

        // When
        List<AdherentDTO> dtos = mapper.toDTOList(adherents);

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
        AdherentDTO dto1 = new AdherentDTO();
        dto1.setId(1);
        dto1.setNom("Doe");
        dto1.setPrenom("John");
        dto1.setEmail("john.doe@example.com");

        AdherentDTO dto2 = new AdherentDTO();
        dto2.setId(2);
        dto2.setNom("Smith");
        dto2.setPrenom("Jane");
        dto2.setEmail("jane.smith@example.com");

        List<AdherentDTO> dtos = Arrays.asList(dto1, dto2);

        // When
        List<Adherent> adherents = mapper.toEntityList(dtos);

        // Then
        assertNotNull(adherents);
        assertEquals(2, adherents.size());
        assertEquals(1, adherents.get(0).getId());
        assertEquals("Doe", adherents.get(0).getNom());
        assertEquals("John", adherents.get(0).getPrénom());
        assertEquals("john.doe@example.com", adherents.get(0).getEmail());
        // Ignored fields should be null
        assertNull(adherents.get(0).getPanier());
        assertNull(adherents.get(0).getCommandes());
        assertNull(adherents.get(0).getAvis());
        assertNull(adherents.get(0).getMotDePasse());

        assertEquals(2, adherents.get(1).getId());
        assertEquals("Smith", adherents.get(1).getNom());
        assertEquals("Jane", adherents.get(1).getPrénom());
        assertEquals("jane.smith@example.com", adherents.get(1).getEmail());
        // Ignored fields should be null
        assertNull(adherents.get(1).getPanier());
        assertNull(adherents.get(1).getCommandes());
        assertNull(adherents.get(1).getAvis());
        assertNull(adherents.get(1).getMotDePasse());
    }
}