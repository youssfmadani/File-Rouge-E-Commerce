package com.example.backend.mapper;

import com.example.backend.dto.UtilisateurDTO;
import com.example.backend.entity.Utilisateur;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UtilisateurMapper {

    UtilisateurMapper INSTANCE = Mappers.getMapper(UtilisateurMapper.class);

    @Mapping(source = "prénom", target = "prenom")
    UtilisateurDTO toDTO(Utilisateur utilisateur);

    @Mapping(source = "prenom", target = "prénom")
    Utilisateur toEntity(UtilisateurDTO utilisateurDTO);

    List<UtilisateurDTO> toDTOList(List<Utilisateur> utilisateurs);

    List<Utilisateur> toEntityList(List<UtilisateurDTO> utilisateurDTOs);
} 