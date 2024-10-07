package org.example.projectvm.controller;


import org.example.projectvm.entity.Inscripciones;
import org.example.projectvm.service.InscripcionesService;
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

    // Crear
    @PostMapping
    public Inscripciones createUser(@RequestBody Inscripciones inscripciones) {
        return inscripcionesService.create(inscripciones);
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
}
