package org.example.projectvm.service;


import org.example.projectvm.entity.Evento;
import org.example.projectvm.entity.Inscripciones;
import org.example.projectvm.entity.User;
import org.example.projectvm.repository.InscripcionesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InscripcionesService {
    @Autowired
    private InscripcionesRepository inscripcionesRepository;

    // Listar todos
    public List<Inscripciones> getAll() {
        return inscripcionesRepository.findAll();
    }
    // Obtener por ID
    public Optional<Inscripciones> getById(Integer id) {
        return inscripcionesRepository.findById(id);
    }

    // Crear
    public Inscripciones create(Inscripciones inscripciones) {
        return inscripcionesRepository.save(inscripciones);
    }
    public boolean verificarInscripcion(Integer usuarioId, Integer eventoId) {
        return inscripcionesRepository.findByUsuarioIdAndEventoId(usuarioId, eventoId).isPresent();
    }
    // Eliminar
    public void delete(Integer id) {
        inscripcionesRepository.deleteById(id);
    }
    public List<User> obtenerParticipantesPorEvento(Integer eventoId) {
        return inscripcionesRepository.findByEventoId(eventoId).stream()
                .map(Inscripciones::getUsuario)
                .collect(Collectors.toList());
    }
    public List<Evento> getEventosPorUsuarioId(Integer usuarioId) {
        return inscripcionesRepository.findEventosByUsuarioId(usuarioId);
    }


    //Actualizar
    public Inscripciones actualizar(Inscripciones inscripciones) {
        return inscripcionesRepository.save(inscripciones);
    }
}

