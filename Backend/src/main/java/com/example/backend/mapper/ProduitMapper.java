package com.example.backend.mapper;

import com.example.backend.dto.ProduitDTO;
import com.example.backend.entity.Produit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProduitMapper {

    ProduitMapper INSTANCE = Mappers.getMapper(ProduitMapper.class);

    @Mapping(source = "idProduit", target = "id")
    @Mapping(source = "categorie.id", target = "categorieId")
    ProduitDTO toDTO(Produit produit);

    @Mapping(source = "id", target = "idProduit")
    @Mapping(target = "categorie", ignore = true)
    Produit toEntity(ProduitDTO produitDTO);

    List<ProduitDTO> toDTOList(List<Produit> produits);

    List<Produit> toEntityList(List<ProduitDTO> produitDTOs);
} 