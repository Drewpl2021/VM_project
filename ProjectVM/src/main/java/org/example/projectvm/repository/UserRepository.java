package org.example.projectvm.repository;

import org.example.projectvm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository  extends JpaRepository<User, Integer> {
    Optional<User> findByDni(String dni);  // Buscar por DNI
    Optional<User> findByCodigo(String codigo);  // Buscar por Código
}
