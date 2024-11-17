package org.example.projectvm.repository;

import org.example.projectvm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface UserRepository  extends JpaRepository<User, Integer> {
    Optional<User> findByDni(String dni);  // Buscar por DNI
    Optional<User> findByCodigo(String codigo);// Buscar por Código
    Optional<User> findByEmail(String email);
    List<User> findByNombreContaining(String nombre);
    List<User> findByApellidoContaining(String apellido);
    boolean existsByDni(String dni);
    boolean existsByCodigo(String codigo);
    List<User> findByIdNotIn(List<Integer> ids);
    @Query("SELECT u FROM User u WHERE u.id NOT IN :ids AND u.status = 'Estudiante'")
    List<User> findByIdNotInAndStatusEstudiante(@Param("ids") List<Integer> ids);


}
