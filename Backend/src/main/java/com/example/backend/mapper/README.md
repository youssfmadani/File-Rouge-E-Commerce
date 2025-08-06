# Mapper Package Documentation

This package contains MapStruct-based mappers for converting between entities and DTOs in the FileRouge backend application.

## Overview

The mapper package provides efficient and type-safe conversion between JPA entities and DTOs using MapStruct. This eliminates the need for manual mapping code and reduces boilerplate.

## Available Mappers

### 1. ProduitMapper
- **Entity**: `Produit`
- **DTO**: `ProduitDTO`
- **Key mappings**:
  - `idProduit` ↔ `id`
  - `categorie.id` ↔ `categorieId`

### 2. AdherentMapper
- **Entity**: `Adherent` (extends `Utilisateur`)
- **DTO**: `AdherentDTO`
- **Key mappings**:
  - `prénom` ↔ `prenom`
  - Ignores: `panier`, `commandes`, `avis`, `motDePasse`

### 3. AdministrateurMapper
- **Entity**: `Administrateur` (extends `Utilisateur`)
- **DTO**: `AdministrateurDTO`
- **Key mappings**:
  - `prénom` ↔ `prenom`
  - Ignores: `motDePasse`

### 4. ProfessionelMapper
- **Entity**: `Professionel` (extends `Utilisateur`)
- **DTO**: `ProfessionelDTO`
- **Key mappings**:
  - `prénom` ↔ `prenom`
  - Ignores: `motDePasse`

### 5. CommandeMapper
- **Entity**: `Commande`
- **DTO**: `CommandeDTO`
- **Key mappings**:
  - `idCommande` ↔ `id`
  - `adherent.id` ↔ `adherentId`
  - `produits` → `produitIds` (extracts IDs)

### 6. PanierMapper
- **Entity**: `Panier`
- **DTO**: `PanierDTO`
- **Key mappings**:
  - `idPanier` ↔ `id`
  - `adherent.id` ↔ `adherentId`
  - `produits` → `produitIds` (extracts IDs)

### 7. CategorieMapper
- **Entity**: `Categorie`
- **DTO**: `CategorieDTO`
- **Key mappings**:
  - `idCategorie` ↔ `id`

### 8. UtilisateurMapper
- **Entity**: `Utilisateur`
- **DTO**: `UtilisateurDTO`
- **Key mappings**:
  - `prénom` ↔ `prenom`
  - Ignores: `motDePasse`

## Usage Examples

### In Services

```java
@Service
public class ProduitServiceImpl implements ProduitService {
    
    @Autowired
    private ProduitMapper produitMapper;
    
    @Override
    public ProduitDTO getProduitById(Integer id) {
        Produit produit = produitRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Produit not found"));
        return produitMapper.toDTO(produit);
    }
    
    @Override
    public List<ProduitDTO> getAllProduits() {
        return produitRepository.findAll()
            .stream()
            .map(produitMapper::toDTO)
            .collect(Collectors.toList());
    }
}
```

### Using MapperConfig

```java
@Autowired
private MapperConfig mapperConfig;

public void example() {
    ProduitMapper produitMapper = mapperConfig.getProduitMapper();
    AdherentMapper adherentMapper = mapperConfig.getAdherentMapper();
    
    // Use mappers...
}
```

### Using MapperUtils

```java
import static com.example.backend.mapper.MapperUtils.mapSafely;
import static com.example.backend.mapper.MapperUtils.mapListSafely;

// Safe mapping with null checks
ProduitDTO dto = mapSafely(produit, produitMapper::toDTO);
List<ProduitDTO> dtos = mapListSafely(produits, produitMapper::toDTO);
```

## Configuration

### Maven Dependencies

The following dependencies are required in `pom.xml`:

```xml
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>1.5.5.Final</version>
    <scope>provided</scope>
</dependency>
```

### Maven Compiler Plugin

The annotation processor must be configured:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <annotationProcessorPaths>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </path>
            <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>1.5.5.Final</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

## Best Practices

1. **Always use the mapper interfaces** instead of manual mapping
2. **Use `@Autowired`** to inject mappers in services
3. **Handle relationships carefully** - some mappings ignore relationships to avoid circular references
4. **Use `MapperUtils`** for safe mapping operations with null checks
5. **Keep mappers simple** - complex business logic should be in services

## Generated Code

MapStruct generates implementation classes at compile time. These are located in:
- `target/generated-sources/annotations/`

The generated classes follow the naming pattern: `{MapperName}Impl`

## Troubleshooting

### Common Issues

1. **"Cannot resolve symbol" errors**: Ensure MapStruct dependencies are properly configured
2. **Circular reference errors**: Use `@Mapping(target = "field", ignore = true)` to ignore problematic fields
3. **Null pointer exceptions**: Use `MapperUtils.mapSafely()` for null-safe operations

### Rebuilding

If you encounter issues with generated code:
```bash
mvn clean compile
```

This will regenerate all mapper implementations. 