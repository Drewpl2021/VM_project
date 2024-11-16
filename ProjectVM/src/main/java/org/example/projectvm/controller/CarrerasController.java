package org.example.projectvm.controller;


import jakarta.annotation.PostConstruct;
import org.example.projectvm.entity.Carreras;
import org.example.projectvm.repository.CarrerasRepository;
import org.example.projectvm.service.CarrerasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carreras")
@CrossOrigin(origins = "http://localhost:4200")
public class CarrerasController {
    @Autowired
    private CarrerasService carrerasService;
    @Autowired
    private CarrerasRepository carrerasRepository;

    // Listar todos
    @GetMapping
    public List<Carreras> getAll() {
        return carrerasService.getAll();
    }

    // Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<Carreras> getById(@PathVariable Integer id) {
        return carrerasService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear
    @PostMapping
    public Carreras createUser(@RequestBody Carreras carreras) {
        return carrerasService.create(carreras);
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        carrerasService.delete(id);
        return ResponseEntity.noContent().build();
    }

    //Actualizar
    @PutMapping("/{id}")
    public ResponseEntity<Carreras> actualizar(@PathVariable Integer id, @RequestBody Carreras carreras) {
        // Aquí puedes verificar que el ID del usuario en el cuerpo coincide con el ID de la ruta
        carreras.setId(id); // Establece el ID para asegurarte de que estás actualizando el registro correcto
        Carreras updatedUser = carrerasService.actualizar(carreras);
        return ResponseEntity.ok(updatedUser);
    }

    @PostConstruct
    public void initCarreras() {
        if (carrerasRepository.count() == 0) { // Verifica si la tabla está vacía
            Carreras carrera = new Carreras();
            carrera.setNombre("Ingeniería de Sistemas");
            carrerasRepository.save(carrera); // Guarda el registro en la base de datos
        }
    }
}
