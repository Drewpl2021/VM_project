package org.example.projectvm.controller;


import org.example.projectvm.entity.Evento;
import org.example.projectvm.entity.Inscripciones;
import org.example.projectvm.entity.User;
import org.example.projectvm.service.EventoService;
import org.example.projectvm.service.InscripcionesService;
import org.example.projectvm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inscripciones")
@CrossOrigin(origins = "http://localhost:4200")
public class InscripcionesController {
    @Autowired
    private InscripcionesService inscripcionesService;
    @Autowired
    private UserService userService;
    @Autowired
    private EventoService eventoService;

    // Listar todos
    @GetMapping
    public List<Inscripciones> getAll() {
        return inscripcionesService.getAll();
    }

    // Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<Inscripciones> getById(@PathVariable Integer id) {
        return inscripcionesService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Inscripciones> createInscripciones(@RequestBody Inscripciones inscripcion) {
        // Obtener los IDs de usuario y evento
        Integer userId = inscripcion.getUsuario().getId();
        Integer eventoId = inscripcion.getEvento().getId();

        // Buscar el usuario y el evento por sus IDs
        User usuario = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Evento evento = eventoService.getById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        // Asignar las entidades encontradas a la inscripción
        inscripcion.setUsuario(usuario);
        inscripcion.setEvento(evento);

        // Guardar la inscripción
        Inscripciones savedInscripcion = inscripcionesService.create(inscripcion);

        return ResponseEntity.ok(savedInscripcion);
    }
    // InscripcionesController.java
    @GetMapping("/verificar")
    public ResponseEntity<Boolean> verificarInscripcion(
            @RequestParam Integer usuarioId,
            @RequestParam Integer eventoId) {
        boolean existe = inscripcionesService.verificarInscripcion(usuarioId, eventoId);
        return ResponseEntity.ok(existe);
    }

    @GetMapping("/evento/{eventoId}/participantes")
    public ResponseEntity<List<User>> obtenerParticipantesPorEvento(@PathVariable Integer eventoId) {
        List<User> participantes = inscripcionesService.obtenerParticipantesPorEvento(eventoId);
        return ResponseEntity.ok(participantes);
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        inscripcionesService.delete(id);
        return ResponseEntity.noContent().build();
    }

    //Actualizar
    @PutMapping("/{id}")
    public ResponseEntity<Inscripciones> actualizar(@PathVariable Integer id, @RequestBody Inscripciones inscripciones) {
        // Aquí puedes verificar que el ID del usuario en el cuerpo coincide con el ID de la ruta
        inscripciones.setId(id); // Establece el ID para asegurarte de que estás actualizando el registro correcto
        Inscripciones updatedUser = inscripcionesService.actualizar(inscripciones);
        return ResponseEntity.ok(updatedUser);
    }

    // Obtener eventos en los que un usuario está inscrito
    @GetMapping("/usuario/{usuarioId}/eventos")
    public List<Evento> getEventosPorUsuarioId(@PathVariable Integer usuarioId) {
        return inscripcionesService.getEventosPorUsuarioId(usuarioId);
    }
}
