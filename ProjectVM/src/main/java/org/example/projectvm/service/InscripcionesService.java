package org.example.projectvm.service;


import org.example.projectvm.entity.Inscripciones;
import org.example.projectvm.repository.InscripcionesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InscripcionesService {
    @Autowired
    private InscripcionesRepository inscripcionesRepository;

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

    // Eliminar
    public void delete(Integer id) {
        inscripcionesRepository.deleteById(id);
    }

    //Actualizar
    public Inscripciones actualizar(Inscripciones inscripciones) {
        return inscripcionesRepository.save(inscripciones);
    }
}
