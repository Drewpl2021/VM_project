package org.example.projectvm.controller;

import org.example.projectvm.entity.User;
import org.example.projectvm.repository.UserRepository;
import org.example.projectvm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    // Listar todos los usuarios
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Obtener un usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Obtener un usuario por Codigo
    @GetMapping("codigo/{codigo}")
    public ResponseEntity<User> buscarPorCodigo(@PathVariable String codigo) {
        Optional<User> carrera = userService.buscarPorCodigo(codigo);
        return carrera.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Obtener un usuario por DNI
    @GetMapping("dni/{dni}")
    public ResponseEntity<User> buscarPorDni(@PathVariable String dni) {
        Optional<User> carrera = userService.buscarPorDni(dni);
        return carrera.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un nuevo usuario
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // Eliminar un usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    //Actualizar
    @PutMapping("/{id}")
    public ResponseEntity<User> actualizarUsuario(@PathVariable Integer id, @RequestBody User user) {
        // Aquí puedes verificar que el ID del usuario en el cuerpo coincide con el ID de la ruta
        user.setId(id); // Establece el ID para asegurarte de que estás actualizando el registro correcto
        User updatedUser = userService.actualizar(user);
        return ResponseEntity.ok(updatedUser);
    }

}
