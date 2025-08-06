package com.example.backend.mapper;

import com.example.backend.dto.PanierDTO;
import com.example.backend.entity.Panier;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", imports = {java.util.stream.Collectors.class})
public interface PanierMapper {

    PanierMapper INSTANCE = Mappers.getMapper(PanierMapper.class);

    @Mapping(source = "idPanier", target = "id")
    @Mapping(source = "adherent.id", target = "adherentId")
    @Mapping(target = "produitIds", expression = "java(panier.getProduits() != null ? panier.getProduits().stream().map(p -> p.getIdProduit()).collect(Collectors.toList()) : null)")
    PanierDTO toDTO(Panier panier);

    @Mapping(source = "id", target = "idPanier")
    @Mapping(target = "adherent", ignore = true)
    @Mapping(target = "produits", ignore = true)
    Panier toEntity(PanierDTO panierDTO);

    List<PanierDTO> toDTOList(List<Panier> paniers);

    List<Panier> toEntityList(List<PanierDTO> panierDTOs);
} 