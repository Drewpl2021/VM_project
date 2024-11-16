package org.example.projectvm.controller;


import jakarta.annotation.PostConstruct;
import org.example.projectvm.entity.Roles;
import org.example.projectvm.repository.RolesRepository;
import org.example.projectvm.service.RolesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@CrossOrigin(origins = "http://localhost:4200")
public class RolesController {
    @Autowired
    private RolesService rolesService;

    @Autowired
    private RolesRepository rolesRepository;

    // Listar todos
    @GetMapping
    public List<Roles> getAll() {
        return rolesService.getAll();
    }

    // Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<Roles> getById(@PathVariable Integer id) {
        return rolesService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear
    @PostMapping
    public Roles createUser(@RequestBody Roles roles) {
        return rolesService.create(roles);
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        rolesService.delete(id);
        return ResponseEntity.noContent().build();
    }

    //Actualizar
    @PutMapping("/{id}")
    public ResponseEntity<Roles> actualizar(@PathVariable Integer id, @RequestBody Roles roles) {
        // Aquí puedes verificar que el ID del usuario en el cuerpo coincide con el ID de la ruta
        roles.setId(id); // Establece el ID para asegurarte de que estás actualizando el registro correcto
        Roles updatedUser = rolesService.actualizar(roles);
        return ResponseEntity.ok(updatedUser);
    }

    @PostConstruct
    public void initRoles() {
        if (rolesRepository.count() == 0) { // Verifica si la tabla está vacía
            rolesRepository.save(new Roles(null, "Estudiante"));
            rolesRepository.save(new Roles(null, "Coordinador"));
            rolesRepository.save(new Roles(null, "Administrador"));
        }
    }
}
