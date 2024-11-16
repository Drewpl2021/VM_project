package org.example.projectvm.repository;

import org.example.projectvm.entity.Evento;
import org.example.projectvm.entity.Inscripciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InscripcionesRepository extends JpaRepository<Inscripciones, Integer> {
    Optional<Inscripciones> findByUsuarioIdAndEventoId(Integer usuarioId, Integer eventoId);
    List<Inscripciones> findByEventoId(Integer eventoId);
    @Query("SELECT i.evento FROM Inscripciones i WHERE i.usuario.id = :usuarioId")
    List<Evento> findEventosByUsuarioId(@Param("usuarioId") Integer usuarioId);
    List<Inscripciones> findByUsuarioId(Integer usuarioId);

}
