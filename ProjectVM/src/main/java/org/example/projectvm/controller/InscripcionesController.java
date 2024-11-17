package org.example.projectvm.controller;


import org.example.projectvm.entity.Evento;
import org.example.projectvm.entity.Inscripciones;
import org.example.projectvm.entity.User;
import org.example.projectvm.repository.EventoRepository;
import org.example.projectvm.repository.InscripcionesRepository;
import org.example.projectvm.repository.UserRepository;
import org.example.projectvm.service.EventoService;
import org.example.projectvm.service.InscripcionesService;
import org.example.projectvm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/inscripciones")
@CrossOrigin(origins = "http://localhost:4200")
public class InscripcionesController {
    @Autowired
    private InscripcionesService inscripcionesService;
    @Autowired
    private UserService userService;
    @Autowired
    private EventoService eventoService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EventoRepository eventoRepository;
    @Autowired
    private InscripcionesRepository inscripcionesRepository;

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

    @PostMapping
    public ResponseEntity<Inscripciones> createInscripciones(@RequestBody Inscripciones inscripcion) {
        Integer userId = inscripcion.getUsuario().getId();
        Integer eventoId = inscripcion.getEvento().getId();

        User usuario = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Evento evento = eventoService.getById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        inscripcion.setUsuario(usuario);
        inscripcion.setEvento(evento);

        Inscripciones savedInscripcion = inscripcionesService.create(inscripcion);

        // Llamada al método para actualizar horas del usuario
        inscripcionesService.actualizarHorasUsuario(userId);

        return ResponseEntity.ok(savedInscripcion);
    }


    // InscripcionesController.java
    @GetMapping("/verificar")
    public ResponseEntity<Boolean> verificarInscripcion(
            @RequestParam Integer usuarioId,
            @RequestParam Integer eventoId) {
        boolean existe = inscripcionesService.verificarInscripcion(usuarioId, eventoId);
        return ResponseEntity.ok(existe);
    }

    @GetMapping("/evento/{eventoId}/participantes")
    public ResponseEntity<List<Map<String, Object>>> obtenerParticipantesPorEvento(@PathVariable Integer eventoId) {
        List<Map<String, Object>> participantes = inscripcionesService.obtenerParticipantesPorEvento(eventoId);
        return ResponseEntity.ok(participantes);
    }



    // Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        Inscripciones inscripcion = inscripcionesService.getById(id)
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));

        inscripcionesService.delete(id);

        // Llamada al método para actualizar horas del usuario
        inscripcionesService.actualizarHorasUsuario(inscripcion.getUsuario().getId());

        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{id}")
    public ResponseEntity<Inscripciones> actualizar(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        Optional<Inscripciones> inscripcionOptional = inscripcionesService.getById(id);

        if (inscripcionOptional.isPresent()) {
            Inscripciones inscripcion = inscripcionOptional.get();

            // Actualizar las horas obtenidas si se incluye en el cuerpo de la solicitud
            if (updates.containsKey("horas_obtenidas")) {
                inscripcion.setHoras_obtenidas((Integer) updates.get("horas_obtenidas"));
            }
            if (updates.containsKey("detalles")) {
                inscripcion.setDetalles((String) updates.get("detalles"));
            }

            Inscripciones updatedInscripcion = inscripcionesService.actualizar(inscripcion);

            // Actualizar las horas obtenidas en el usuario relacionado
            inscripcionesService.actualizarHorasUsuario(inscripcion.getUsuario().getId());

            return ResponseEntity.ok(updatedInscripcion);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



    // Obtener eventos en los que un usuario está inscrito
    @GetMapping("/usuario/{usuarioId}/eventos")
    public List<Evento> getEventosPorUsuarioId(@PathVariable Integer usuarioId) {
        return inscripcionesService.getEventosPorUsuarioId(usuarioId);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Inscripciones> getInscripcionesPorUsuario(@PathVariable Integer usuarioId) {
        return inscripcionesService.findByUsuarioId(usuarioId);
    }

    @PostMapping("/batch")
    public ResponseEntity<?> agregarInscripciones(@RequestBody List<Map<String, Object>> inscripcionesData) {
        List<Inscripciones> inscripciones = inscripcionesData.stream().map(data -> {
            Inscripciones inscripcion = new Inscripciones();
            inscripcion.setUsuario(userRepository.findById((Integer) data.get("usuarioId")).orElse(null));
            inscripcion.setEvento(eventoRepository.findById((Integer) data.get("eventoId")).orElse(null));
            inscripcion.setHoras_obtenidas((Integer) data.get("horas_obtenidas"));
            inscripcion.setAnio_academico((String) data.get("anio_academico"));
            inscripcion.setDetalles((String) data.get("detalles"));
            return inscripcion;
        }).collect(Collectors.toList());

        inscripcionesRepository.saveAll(inscripciones);
        return ResponseEntity.ok("Inscripciones agregadas correctamente.");
    }

    @PostMapping("/importarparticipantes/{eventoId}")
    public ResponseEntity<String> importarParticipantesDesdeExcel(
            @PathVariable Integer eventoId,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo está vacío.");
        }

        try {
            List<String> mensajesOmitidos = inscripcionesService.registrarParticipantesDesdeExcel(eventoId, file);
            String mensaje = "Archivo cargado y participantes registrados exitosamente.";
            if (!mensajesOmitidos.isEmpty()) {
                mensaje += " Se omitieron " + mensajesOmitidos.size() + " filas debido a errores o duplicados.";
            }
            return ResponseEntity.ok(mensaje);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar el archivo.");
        }
    }

}
