package com.example.backend;

import com.example.backend.dto.CategorieDTO;
import com.example.backend.entity.Categorie;
import com.example.backend.mapper.CategorieMapper;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.junit.jupiter.api.Assertions.*;

public class CategorieMapperTest {
    private final CategorieMapper mapper = Mappers.getMapper(CategorieMapper.class);

    @Test
    void testEntityToDTO() {
        // TODO: implement
    }

    @Test
    void testDTOToEntity() {
        // TODO: implement
    }

    @Test
    void testNullSafety() {
        assertNull(mapper.toDTO(null));
        assertNull(mapper.toEntity(null));
    }
} 