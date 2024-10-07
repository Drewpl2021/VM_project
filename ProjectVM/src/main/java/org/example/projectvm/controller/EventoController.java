package org.example.projectvm.controller;


import org.example.projectvm.entity.Evento;
import org.example.projectvm.service.EventoService;
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
    public Evento createUser(@RequestBody Evento evento) {
        return eventoService.create(evento);
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        eventoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    //Actualizar
    @PutMapping("/{id}")
    public ResponseEntity<Evento> actualizar(@PathVariable Integer id, @RequestBody Evento evento) {
        // Aquí puedes verificar que el ID del usuario en el cuerpo coincide con el ID de la ruta
        evento.setId(id); // Establece el ID para asegurarte de que estás actualizando el registro correcto
        Evento updatedUser = eventoService.actualizar(evento);
        return ResponseEntity.ok(updatedUser);
    }
}
