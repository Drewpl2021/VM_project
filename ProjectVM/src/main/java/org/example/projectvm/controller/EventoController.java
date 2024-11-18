package org.example.projectvm.controller;


import org.example.projectvm.entity.Evento;
import org.example.projectvm.entity.Inscripciones;
import org.example.projectvm.service.EventoService;
import org.example.projectvm.service.InscripcionesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/evento")
@CrossOrigin(origins = "http://localhost:4200")
public class EventoController {
    @Autowired
    private EventoService eventoService;
    @Autowired
    private InscripcionesService inscripcionesService;

    // Listar todos
    @GetMapping
    public List<Evento> getAll() {
        return eventoService.getAll();
    }

    // Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<Evento> getById(@PathVariable Integer id) {
        return eventoService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear
    @PostMapping
    public Evento createEvento(@RequestBody Evento evento) {
        return eventoService.create(evento);
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        eventoService.delete(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}")
    public ResponseEntity<Evento> actualizar(@PathVariable Integer id, @RequestBody Evento evento) {
        // Establecer el ID para asegurarte de que estás actualizando el registro correcto
        evento.setId(id);

        // Actualiza el evento
        Evento updatedEvento = eventoService.actualizar(evento);

        // Obtener todas las inscripciones asociadas al evento
        List<Inscripciones> inscripciones = inscripcionesService.findByEventoId(id);

        // Actualizar las horas de los usuarios asociados a estas inscripciones
        for (Inscripciones inscripcion : inscripciones) {
            inscripcionesService.actualizarHorasUsuario(inscripcion.getUsuario().getId());
        }

        return ResponseEntity.ok(updatedEvento);
    }


}
