package org.example.projectvm.repository;

import org.example.projectvm.entity.Inscripciones;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InscripcionesRepository extends JpaRepository<Inscripciones, Integer> {
    Optional<Inscripciones> findByUsuarioIdAndEventoId(Integer usuarioId, Integer eventoId);

}
