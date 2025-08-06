package com.example.backend.mapper;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class providing common mapping operations and helper methods.
 */
@Component
public class MapperUtils {

    /**
     * Safely maps a list of entities to DTOs using the provided mapper function.
     * Returns null if the input list is null.
     *
     * @param entities the list of entities to map
     * @param mapper the mapper function to apply
     * @param <E> the entity type
     * @param <D> the DTO type
     * @return the mapped list of DTOs, or null if input is null
     */
    public static <E, D> List<D> mapListSafely(List<E> entities, java.util.function.Function<E, D> mapper) {
        if (entities == null) {
            return null;
        }
        return entities.stream()
                .map(mapper)
                .collect(Collectors.toList());
    }

    /**
     * Safely maps a single entity to DTO using the provided mapper function.
     * Returns null if the input entity is null.
     *
     * @param entity the entity to map
     * @param mapper the mapper function to apply
     * @param <E> the entity type
     * @param <D> the DTO type
     * @return the mapped DTO, or null if input is null
     */
    public static <E, D> D mapSafely(E entity, java.util.function.Function<E, D> mapper) {
        if (entity == null) {
            return null;
        }
        return mapper.apply(entity);
    }

    /**
     * Checks if a string is null or empty.
     *
     * @param str the string to check
     * @return true if the string is null or empty, false otherwise
     */
    public static boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    /**
     * Checks if a list is null or empty.
     *
     * @param list the list to check
     * @return true if the list is null or empty, false otherwise
     */
    public static boolean isNullOrEmpty(List<?> list) {
        return list == null || list.isEmpty();
    }
} 