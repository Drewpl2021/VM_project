package org.example.projectvm.controller;

import lombok.Data;
import org.example.projectvm.entity.User;
import org.example.projectvm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> user = userService.findByEmail(loginRequest.getEmail());

        if (user.isPresent()) {
            if (passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
                // Verificar si el usuario tiene "primeringreso" en NO
                if (user.get().getPrimeringreso() == User.Primeringreso.NO) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Primer ingreso. Es necesario cambiar la contraseña.");
                    response.put("primeringreso", true); // Indica al frontend que debe mostrar el formulario de cambio
                    response.put("userId", user.get().getId());
                    return ResponseEntity.ok(response);
                }

                return ResponseEntity.ok(Collections.singletonMap("message", "Inicio de sesión exitoso"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
        }
    }
    @PutMapping("/change-password/{userId}")
    public ResponseEntity<?> changePassword(@PathVariable Integer userId, @RequestBody PasswordChangeRequest request) {
        Optional<User> userOpt = userService.getUserById(userId);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Verificar el estado de primer ingreso
            if (user.getPrimeringreso() == User.Primeringreso.SI) {
                return ResponseEntity.badRequest().body("El usuario ya cambió su contraseña previamente.");
            }

            // Cambiar la contraseña y actualizar "primeringreso"
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            user.setPrimeringreso(User.Primeringreso.SI); // Cambiar a "SI" después de cambiar contraseña

            userService.actualizar(user);

            return ResponseEntity.ok("Contraseña actualizada correctamente.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
        }
    }


    @Data
    public static class PasswordChangeRequest {
        private String currentPassword;
        private String newPassword;


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
            response.put("status", userData.getStatus());
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