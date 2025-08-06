package com.example.backend;

import com.example.backend.dto.UtilisateurDTO;
import com.example.backend.entity.Utilisateur;
import com.example.backend.mapper.UtilisateurMapper;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.junit.jupiter.api.Assertions.*;

public class UtilisateurMapperTest {
    private final UtilisateurMapper mapper = Mappers.getMapper(UtilisateurMapper.class);

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