package com.example.backend;

import com.example.backend.dto.PanierDTO;
import com.example.backend.entity.Panier;
import com.example.backend.mapper.PanierMapper;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.junit.jupiter.api.Assertions.*;

public class PanierMapperTest {
    private final PanierMapper mapper = Mappers.getMapper(PanierMapper.class);

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