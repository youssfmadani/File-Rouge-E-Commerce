package com.example.backend.mapper;

import com.example.backend.dto.ProfessionelDTO;
import com.example.backend.entity.Professionel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProfessionelMapper {

    ProfessionelMapper INSTANCE = Mappers.getMapper(ProfessionelMapper.class);

    @Mapping(source = "prénom", target = "prenom")
    ProfessionelDTO toDTO(Professionel professionel);

    @Mapping(source = "prenom", target = "prénom")
    @Mapping(target = "motDePasse", ignore = true)
    Professionel toEntity(ProfessionelDTO professionelDTO);

    List<ProfessionelDTO> toDTOList(List<Professionel> professionels);

    List<Professionel> toEntityList(List<ProfessionelDTO> professionelDTOs);
} 