/**
 * Mapper package for the FileRouge backend application.
 * 
 * <p>This package contains MapStruct-based mappers that provide efficient and type-safe
 * conversion between JPA entities and DTOs. The mappers eliminate the need for manual
 * mapping code and reduce boilerplate.</p>
 * 
 * <h2>Key Components:</h2>
 * <ul>
 *   <li><strong>Mapper Interfaces:</strong> Define the mapping contracts between entities and DTOs</li>
 *   <li><strong>MapperConfig:</strong> Central configuration class providing access to all mappers</li>
 *   <li><strong>MapperUtils:</strong> Utility class with helper methods for safe mapping operations</li>
 * </ul>
 * 
 * <h2>Available Mappers:</h2>
 * <ul>
 *   <li>{@link com.example.backend.mapper.ProduitMapper} - Maps between Produit entity and ProduitDTO</li>
 *   <li>{@link com.example.backend.mapper.AdherentMapper} - Maps between Adherent entity and AdherentDTO</li>
 *   <li>{@link com.example.backend.mapper.AdministrateurMapper} - Maps between Administrateur entity and AdministrateurDTO</li>
 *   <li>{@link com.example.backend.mapper.ProfessionelMapper} - Maps between Professionel entity and ProfessionelDTO</li>
 *   <li>{@link com.example.backend.mapper.CommandeMapper} - Maps between Commande entity and CommandeDTO</li>
 *   <li>{@link com.example.backend.mapper.PanierMapper} - Maps between Panier entity and PanierDTO</li>
 *   <li>{@link com.example.backend.mapper.CategorieMapper} - Maps between Categorie entity and CategorieDTO</li>
 *   <li>{@link com.example.backend.mapper.UtilisateurMapper} - Maps between Utilisateur entity and UtilisateurDTO</li>
 * </ul>
 * 
 * <h2>Usage Example:</h2>
 * <pre>{@code
 * @Service
 * public class ProduitServiceImpl implements ProduitService {
 *     
 *     @Autowired
 *     private ProduitMapper produitMapper;
 *     
 *     @Override
 *     public ProduitDTO getProduitById(Integer id) {
 *         Produit produit = produitRepository.findById(id)
 *             .orElseThrow(() -> new NotFoundException("Produit not found"));
 *         return produitMapper.toDTO(produit);
 *     }
 * }
 * }</pre>
 * 
 * <h2>Dependencies:</h2>
 * <p>This package requires MapStruct dependencies to be configured in the project's pom.xml:</p>
 * <ul>
 *   <li>mapstruct:1.5.5.Final</li>
 *   <li>mapstruct-processor:1.5.5.Final</li>
 * </ul>
 * 
 * @see com.example.backend.mapper.MapperConfig
 * @see com.example.backend.mapper.MapperUtils
 * @see <a href="https://mapstruct.org/">MapStruct Documentation</a>
 */
package com.example.backend.mapper; 