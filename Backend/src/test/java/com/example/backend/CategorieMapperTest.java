package com.example.backend;

import com.example.backend.dto.CategorieDTO;
import com.example.backend.entity.Categorie;
import com.example.backend.mapper.CategorieMapper;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class CategorieMapperTest {
    private final CategorieMapper mapper = Mappers.getMapper(CategorieMapper.class);

    @Test
    void testEntityToDTO() {
        // Given
        Categorie categorie = new Categorie();
        categorie.setId(1);
        categorie.setNom("Electronics");

        // When
        CategorieDTO dto = mapper.toDTO(categorie);

        // Then
        assertNotNull(dto);
        assertEquals(1, dto.getId());
        assertEquals("Electronics", dto.getNom());
    }

    @Test
    void testDTOToEntity() {
        // Given
        CategorieDTO dto = new CategorieDTO();
        dto.setId(1);
        dto.setNom("Electronics");

        // When
        Categorie categorie = mapper.toEntity(dto);

        // Then
        assertNotNull(categorie);
        assertEquals(1, categorie.getId());
        assertEquals("Electronics", categorie.getNom());
    }

    @Test
    void testNullSafety() {
        assertNull(mapper.toDTO(null));
        assertNull(mapper.toEntity(null));
    }

    @Test
    void testEntityListToDTOList() {
        // Given
        Categorie categorie1 = new Categorie();
        categorie1.setId(1);
        categorie1.setNom("Electronics");

        Categorie categorie2 = new Categorie();
        categorie2.setId(2);
        categorie2.setNom("Clothing");

        List<Categorie> categories = Arrays.asList(categorie1, categorie2);

        // When
        List<CategorieDTO> dtos = mapper.toDTOList(categories);

        // Then
        assertNotNull(dtos);
        assertEquals(2, dtos.size());
        assertEquals(1, dtos.get(0).getId());
        assertEquals("Electronics", dtos.get(0).getNom());
        assertEquals(2, dtos.get(1).getId());
        assertEquals("Clothing", dtos.get(1).getNom());
    }

    @Test
    void testDTOListToEntityList() {
        // Given
        CategorieDTO dto1 = new CategorieDTO();
        dto1.setId(1);
        dto1.setNom("Electronics");

        CategorieDTO dto2 = new CategorieDTO();
        dto2.setId(2);
        dto2.setNom("Clothing");

        List<CategorieDTO> dtos = Arrays.asList(dto1, dto2);

        // When
        List<Categorie> categories = mapper.toEntityList(dtos);

        // Then
        assertNotNull(categories);
        assertEquals(2, categories.size());
        assertEquals(1, categories.get(0).getId());
        assertEquals("Electronics", categories.get(0).getNom());
        assertEquals(2, categories.get(1).getId());
        assertEquals("Clothing", categories.get(1).getNom());
    }
}