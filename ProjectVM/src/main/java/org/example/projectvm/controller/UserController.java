package org.example.projectvm.controller;

import jakarta.annotation.PostConstruct;
import org.example.projectvm.dto.UserDto;
import org.example.projectvm.entity.Carreras;
import org.example.projectvm.entity.Roles;
import org.example.projectvm.entity.User;
import org.example.projectvm.repository.CarrerasRepository;
import org.example.projectvm.repository.RolesRepository;
import org.example.projectvm.repository.UserRepository;
import org.example.projectvm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RolesRepository rolesRepository;
    @Autowired
    private CarrerasRepository carrerasRepository;

    // Listar todos los usuarios
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Obtener un usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Integer id) {
        Optional<User> user = userService.getUserById(id);

        if (user.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.get().getId());
            response.put("nombre", user.get().getNombre());
            response.put("apellido", user.get().getApellido());
            response.put("dni", user.get().getDni());
            response.put("codigo", user.get().getCodigo());
            response.put("email", user.get().getEmail());
            response.put("horas_obtenidas", user.get().getHoras_obtenidas());
            response.put("status", user.get().getStatus().name());
            response.put("carreras_id", user.get().getCarrera().getId()); // Solo el ID
            response.put("roles_id", user.get().getRol().getId()); // Solo el ID
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
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
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (user.getRol() == null || user.getRol().getId() == null) {
            return ResponseEntity.badRequest().body("El rol es obligatorio y debe incluir un ID.");
        }
        if (user.getCarrera() == null || user.getCarrera().getId() == null) {
            return ResponseEntity.badRequest().body("La carrera es obligatoria y debe incluir un ID.");
        }

        // Verificar que los IDs de rol y carrera existan en la base de datos
        Roles rol = rolesRepository.findById(user.getRol().getId())
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado con ID: " + user.getRol().getId()));
        Carreras carrera = carrerasRepository.findById(user.getCarrera().getId())
                .orElseThrow(() -> new IllegalArgumentException("Carrera no encontrada con ID: " + user.getCarrera().getId()));

        user.setRol(rol);
        user.setCarrera(carrera);

        // Guardar el usuario en la base de datos
        userRepository.save(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Usuario creado exitosamente");
        return ResponseEntity.ok(response);
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

    @PostConstruct
    public void initUsuario() {
        if (userRepository.count() == 0) { // Verifica si no hay usuarios registrados
            // Busca el rol con ID 2
            Roles rol = rolesRepository.findById(2).orElseThrow(() -> new RuntimeException("Rol no encontrado"));

            // Busca la carrera con ID 1
            Carreras carrera = carrerasRepository.findById(1).orElseThrow(() -> new RuntimeException("Carrera no encontrada"));

            // Crea un nuevo usuario
            User usuario = new User();
            usuario.setNombre("Eder");
            usuario.setApellido("Gutierrez Quispe");
            usuario.setDni("41857964");
            usuario.setCodigo("000000000"); // Campo código como NULL
            usuario.setEmail("eder.gutierres@gmail.com");
            //BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            //usuario.setPassword(encoder.encode("12345"));
            usuario.setPassword("12345");
            usuario.setPrivate_ingreso("1");
            usuario.setHoras_obtenidas(0);
            usuario.setStatus(User.Status.Docente); // Estado inicial
            usuario.setRol(rol); // Asigna el rol con ID 2
            usuario.setCarrera(carrera); // Asigna la carrera con ID 1

            // Guarda el usuario en la base de datos
            userRepository.save(usuario);
        }
    }
}
