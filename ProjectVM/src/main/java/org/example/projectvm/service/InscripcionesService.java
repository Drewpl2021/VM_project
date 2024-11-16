package org.example.projectvm.service;


import org.example.projectvm.entity.Evento;
import org.example.projectvm.entity.Inscripciones;
import org.example.projectvm.entity.User;
import org.example.projectvm.repository.InscripcionesRepository;
import org.example.projectvm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InscripcionesService {
    @Autowired
    private InscripcionesRepository inscripcionesRepository;

    @Autowired
    private UserRepository userRepository;

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


    public List<Map<String, Object>> obtenerParticipantesPorEvento(Integer eventoId) {
        return inscripcionesRepository.findByEventoId(eventoId).stream()
                .map(inscripcion -> {
                    Map<String, Object> participanteData = new HashMap<>();
                    participanteData.put("idInscripcion", inscripcion.getId()); // Incluye el ID de la inscripción
                    participanteData.put("idUsuario", inscripcion.getUsuario().getId());
                    participanteData.put("nombre", inscripcion.getUsuario().getNombre());
                    participanteData.put("apellido", inscripcion.getUsuario().getApellido());
                    participanteData.put("codigo", inscripcion.getUsuario().getCodigo());
                    participanteData.put("horas_obtenidas", inscripcion.getHoras_obtenidas()); // Horas obtenidas
                    return participanteData;
                })
                .collect(Collectors.toList());
    }




    public List<Evento> getEventosPorUsuarioId(Integer usuarioId) {
        return inscripcionesRepository.findEventosByUsuarioId(usuarioId);
    }


    //Actualizar
    public Inscripciones actualizar(Inscripciones inscripciones) {
        return inscripcionesRepository.save(inscripciones);
    }

    public void actualizarHorasUsuario(Integer userId) {
        // Sumar todas las horas obtenidas de las inscripciones del usuario
        Integer totalHoras = inscripcionesRepository.findByUsuarioId(userId).stream()
                .mapToInt(Inscripciones::getHoras_obtenidas)
                .sum();

        // Actualizar el campo horas_obtenidas en la tabla usuarios
        User usuario = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setHoras_obtenidas(totalHoras);

        userRepository.save(usuario);
    }

}

