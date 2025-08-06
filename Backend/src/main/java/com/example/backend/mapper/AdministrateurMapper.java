package com.example.backend.mapper;

import com.example.backend.dto.AdministrateurDTO;
import com.example.backend.entity.Administrateur;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AdministrateurMapper {

    AdministrateurMapper INSTANCE = Mappers.getMapper(AdministrateurMapper.class);

    @Mapping(source = "prénom", target = "prenom")
    AdministrateurDTO toDTO(Administrateur administrateur);

    @Mapping(source = "prenom", target = "prénom")
    @Mapping(target = "motDePasse", ignore = true)
    Administrateur toEntity(AdministrateurDTO administrateurDTO);

    List<AdministrateurDTO> toDTOList(List<Administrateur> administrateurs);

    List<Administrateur> toEntityList(List<AdministrateurDTO> administrateurDTOs);
} 