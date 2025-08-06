package com.example.backend;

import com.example.backend.dto.CommandeDTO;
import com.example.backend.entity.Commande;
import com.example.backend.mapper.CommandeMapper;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.junit.jupiter.api.Assertions.*;

public class CommandeMapperTest {
    private final CommandeMapper mapper = Mappers.getMapper(CommandeMapper.class);

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