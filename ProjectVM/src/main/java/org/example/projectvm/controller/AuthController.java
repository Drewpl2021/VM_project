package org.example.projectvm.controller;

import lombok.Data;
import org.example.projectvm.entity.User;
import org.example.projectvm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> user = userService.findByEmail(loginRequest.getEmail());

        if (user.isPresent() && user.get().getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.ok(Collections.singletonMap("message", "Inicio de sesión exitoso"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
        }
    }
    @GetMapping("/me")
    public ResponseEntity<?> getAuthenticatedUser(@RequestParam String email) {
        Optional<User> user = userService.findByEmail(email);

        if (user.isPresent()) {
            User userData = user.get();
            // Crea un objeto de respuesta con solo los datos necesarios
            Map<String, Object> response = new HashMap<>();
            response.put("id", userData.getId());
            response.put("nombre", userData.getNombre());
            response.put("apellido", userData.getApellido());
            response.put("email", userData.getEmail());
            // Obtiene el nombre o el ID del rol y lo agrega a la respuesta
            response.put("rol", userData.getRol().getNombre()); // Ajusta según tu modelo de Roles

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }
}
@Data
// Clase para manejar la solicitud de inicio de sesión
class LoginRequest {
    private String email;
    private String password;

    // Getters y setters
}