package com.example.backend.mapper;

import com.example.backend.dto.AdherentDTO;
import com.example.backend.entity.Adherent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AdherentMapper{

    AdherentMapper INSTANCE = Mappers.getMapper(AdherentMapper.class);

    @Mapping(source = "prénom", target = "prenom")
    AdherentDTO toDTO(Adherent adherent);

    @Mapping(source = "prenom", target = "prénom")
    @Mapping(target = "motDePasse", ignore = true)
    @Mapping(target = "commandes", ignore = true)
    Adherent toEntity(AdherentDTO adherentDTO);

    List<AdherentDTO> toDTOList(List<Adherent> adherents);

    List<Adherent> toEntityList(List<AdherentDTO> adherentDTOs);
}