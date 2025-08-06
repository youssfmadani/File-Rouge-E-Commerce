package com.example.backend;

import com.example.backend.dto.ProfessionelDTO;
import com.example.backend.entity.Professionel;
import com.example.backend.mapper.ProfessionelMapper;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.junit.jupiter.api.Assertions.*;

public class ProfessionelMapperTest {
    private final ProfessionelMapper mapper = Mappers.getMapper(ProfessionelMapper.class);

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