package org.example.projectvm.service;


import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.projectvm.entity.Evento;
import org.example.projectvm.entity.Inscripciones;
import org.example.projectvm.entity.User;
import org.example.projectvm.repository.EventoRepository;
import org.example.projectvm.repository.InscripcionesRepository;
import org.example.projectvm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InscripcionesService {
    @Autowired
    private InscripcionesRepository inscripcionesRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EventoRepository eventoRepository;

    // Listar todos
    public List<Inscripciones> getAll() {
        return inscripcionesRepository.findAll();
    }
    // Obtener por ID
    public Optional<Inscripciones> getById(Integer id) {
        return inscripcionesRepository.findById(id);
    }

    // Crear
    public Inscripciones create(Inscripciones inscripciones) {
        return inscripcionesRepository.save(inscripciones);
    }
    public boolean verificarInscripcion(Integer usuarioId, Integer eventoId) {
        return inscripcionesRepository.findByUsuarioIdAndEventoId(usuarioId, eventoId).isPresent();
    }
    // Eliminar
    public void delete(Integer id) {
        inscripcionesRepository.deleteById(id);
    }


    public List<Map<String, Object>> obtenerParticipantesPorEvento(Integer eventoId) {
        return inscripcionesRepository.findByEventoId(eventoId).stream()
                .map(inscripcion -> {
                    Map<String, Object> participanteData = new HashMap<>();
                    participanteData.put("idInscripcion", inscripcion.getId()); // Incluye el ID de la inscripción
                    participanteData.put("idUsuario", inscripcion.getUsuario().getId());
                    participanteData.put("nombre", inscripcion.getUsuario().getNombre());
                    participanteData.put("apellido", inscripcion.getUsuario().getApellido());
                    participanteData.put("codigo", inscripcion.getUsuario().getCodigo());
                    participanteData.put("horas_obtenidas", inscripcion.getHoras_obtenidas()); // Horas obtenidas
                    participanteData.put("detalles", inscripcion.getDetalles());
                    return participanteData;
                })
                .collect(Collectors.toList());
    }




    public List<Evento> getEventosPorUsuarioId(Integer usuarioId) {
        return inscripcionesRepository.findEventosByUsuarioId(usuarioId);
    }


    //Actualizar
    public Inscripciones actualizar(Inscripciones inscripciones) {
        return inscripcionesRepository.save(inscripciones);
    }

    public void actualizarHorasUsuario(Integer userId) {
        // Sumar todas las horas obtenidas de las inscripciones del usuario
        Integer totalHoras = inscripcionesRepository.findByUsuarioId(userId).stream()
                .mapToInt(Inscripciones::getHoras_obtenidas)
                .sum();

        // Actualizar el campo horas_obtenidas en la tabla usuarios
        User usuario = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setHoras_obtenidas(totalHoras);

        userRepository.save(usuario);
    }

    public List<Inscripciones> findByUsuarioId(Integer usuarioId) {
        return inscripcionesRepository.findByUsuarioId(usuarioId);
    }


    public List<String> registrarParticipantesDesdeExcel(Integer eventoId, MultipartFile file) throws Exception {
        List<Inscripciones> inscripcionesARegistrar = new ArrayList<>();
        List<String> mensajesOmitidos = new ArrayList<>();

        // Validar si el evento existe
        Optional<Evento> eventoOpt = eventoRepository.findById(eventoId);
        if (eventoOpt.isEmpty()) {
            throw new IllegalArgumentException("El evento con ID " + eventoId + " no existe.");
        }
        Evento evento = eventoOpt.get();

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // Saltar la fila de encabezados (i=1)
                Row row = sheet.getRow(i);

                if (row == null) continue;

                // Leer solo las columnas B y C
                String codigo = getCellValueAsString(row.getCell(1)); // Columna B
                Double horasObtenidasDouble = row.getCell(2).getNumericCellValue(); // Columna C

                if (codigo == null || horasObtenidasDouble == null) {
                    mensajesOmitidos.add("Fila " + (i + 1) + " omitida: Datos incompletos.");
                    continue;
                }

                int horasObtenidas = horasObtenidasDouble.intValue();

                // Buscar usuario por código
                Optional<User> usuarioOpt = userRepository.findByCodigo(codigo);
                if (usuarioOpt.isEmpty()) {
                    mensajesOmitidos.add("Fila " + (i + 1) + " omitida: Usuario con código " + codigo + " no encontrado.");
                    continue;
                }

                User usuario = usuarioOpt.get();

                // Verificar si ya está inscrito en el evento
                if (inscripcionesRepository.findByUsuarioIdAndEventoId(usuario.getId(), eventoId).isPresent()) {
                    mensajesOmitidos.add("Fila " + (i + 1) + " omitida: Usuario ya está inscrito en el evento.");
                    continue;
                }

                // Crear la inscripción
                Inscripciones inscripcion = new Inscripciones();
                inscripcion.setUsuario(usuario);
                inscripcion.setEvento(evento);
                inscripcion.setHoras_obtenidas(horasObtenidas);
                inscripcion.setAnio_academico("2024"); // Ajusta según tu lógica
                inscripcion.setDetalles("Sin descripción");

                inscripcionesARegistrar.add(inscripcion);
            }
        }

        // Guardar todas las inscripciones válidas
        inscripcionesRepository.saveAll(inscripcionesARegistrar);

        return mensajesOmitidos;
    }

    // Método auxiliar para obtener el valor de una celda como String
    private String getCellValueAsString(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue());
            default:
                return null;
        }
    }


}

