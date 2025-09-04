package com.example.backend.mapper;

import com.example.backend.dto.CategorieDTO;
import com.example.backend.entity.Categorie;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategorieMapper {

    CategorieMapper INSTANCE = Mappers.getMapper(CategorieMapper.class);

    @Mapping(source = "id", target = "id")
    CategorieDTO toDTO(Categorie categorie);

    @Mapping(source = "id", target = "id")
    Categorie toEntity(CategorieDTO categorieDTO);

    List<CategorieDTO> toDTOList(List<Categorie> categories);

    List<Categorie> toEntityList(List<CategorieDTO> categorieDTOs);
} 