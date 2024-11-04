package org.example.projectvm.controller;

import org.example.projectvm.entity.User;
import org.example.projectvm.repository.UserRepository;
import org.example.projectvm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    @GetMapping("nombre/{nombre}")
    public ResponseEntity<List<User>> buscarPorNombre(@PathVariable String nombre) {
        List<User> users = userService.findByNombreContaining(nombre);
        if (users.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("apellido/{apellido}")
    public ResponseEntity<List<User>> buscarPorApellido(@PathVariable String apellido) {
        List<User> users = userService.findByApellidoContaining(apellido);
        if (users.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("buscar")
    public ResponseEntity<List<User>> buscarUsuarios(@RequestParam String termino) {
        List<User> usuarios = new ArrayList<>();

        // Buscar por nombre
        usuarios.addAll(userService.findByNombreContaining(termino));

        // Buscar por apellido
        usuarios.addAll(userService.findByApellidoContaining(termino));

        // Buscar por DNI
        userService.buscarPorDni(termino).ifPresent(usuarios::add);

        // Buscar por código
        userService.buscarPorCodigo(termino).ifPresent(usuarios::add);

        // Eliminar duplicados si es necesario
        usuarios = usuarios.stream().distinct().collect(Collectors.toList());

        if (usuarios.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuarios);
    }




    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo está vacío.");
        }

        try {
            List<String> mensajesOmitidos = userService.saveUsersFromExcel(file);
            String mensaje = "Archivo cargado y datos guardados exitosamente.";
            if (!mensajesOmitidos.isEmpty()) {
                mensaje += " Se omitieron " + mensajesOmitidos.size() + " filas repetidas.";
            }
            return ResponseEntity.ok(mensaje);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar el archivo.");
        }
    }
}
