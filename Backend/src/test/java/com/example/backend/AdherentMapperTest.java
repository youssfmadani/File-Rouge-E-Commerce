package com.example.backend;

import com.example.backend.dto.AdherentDTO;
import com.example.backend.entity.Adherent;
import com.example.backend.mapper.AdherentMapper;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.junit.jupiter.api.Assertions.*;

public class AdherentMapperTest {
    private final AdherentMapper mapper = Mappers.getMapper(AdherentMapper.class);

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