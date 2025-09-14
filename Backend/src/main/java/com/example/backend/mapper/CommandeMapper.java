package com.example.backend.mapper;

import com.example.backend.dto.CommandeDTO;
import com.example.backend.entity.Commande;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", imports = {java.util.stream.Collectors.class})
public interface CommandeMapper {

    CommandeMapper INSTANCE = Mappers.getMapper(CommandeMapper.class);

    @Mapping(source = "idCommande", target = "id")
    @Mapping(source = "statut", target = "statut")
    @Mapping(source = "adherent.id", target = "adherentId")
    @Mapping(source = "montantTotal", target = "montantTotal")
    @Mapping(target = "produitIds", expression = "java(commande.getProduits() != null ? commande.getProduits().stream().map(p -> p.getIdProduit()).collect(Collectors.toList()) : null)")
    CommandeDTO toDTO(Commande commande);

    @Mapping(source = "id", target = "idCommande")
    @Mapping(source = "montantTotal", target = "montantTotal")
    @Mapping(target = "adherent", ignore = true)
    @Mapping(target = "produits", ignore = true)
    Commande toEntity(CommandeDTO commandeDTO);

    List<CommandeDTO> toDTOList(List<Commande> commandes);

    List<Commande> toEntityList(List<CommandeDTO> commandeDTOs);
} 