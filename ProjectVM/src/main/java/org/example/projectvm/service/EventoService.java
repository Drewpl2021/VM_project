package org.example.projectvm.service;


import org.example.projectvm.entity.Evento;
import org.example.projectvm.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventoService {
    @Autowired
    private EventoRepository eventoRepository;

    // Listar todos
    public List<Evento> getAll() {
        return eventoRepository.findAll();
    }
    // Obtener por ID
    public Optional<Evento> getById(Integer id) {
        return eventoRepository.findById(id);
    }

    // Crear
    public Evento create(Evento evento) {
        return eventoRepository.save(evento);
    }

    // Eliminar por ID
    public void delete(Integer id) {
        eventoRepository.deleteById(id);
    }

    //Actualizar
    public Evento actualizar(Evento evento) {
        return eventoRepository.save(evento);
    }
}
