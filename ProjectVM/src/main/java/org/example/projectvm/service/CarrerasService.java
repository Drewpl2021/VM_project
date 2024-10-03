package org.example.projectvm.service;

import org.example.projectvm.entity.Carreras;
import org.example.projectvm.repository.CarrerasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarrerasService {
    @Autowired
    private CarrerasRepository carrerasRepository;

    // Listar todos
    public List<Carreras> getAll() {
        return carrerasRepository.findAll();
    }
    // Obtener por ID
    public Optional<Carreras> getById(Integer id) {
        return carrerasRepository.findById(id);
    }

    // Crear
    public Carreras create(Carreras carreras) {
        return carrerasRepository.save(carreras);
    }

    // Eliminar por ID
    public void delete(Integer id) {
        carrerasRepository.deleteById(id);
    }

    //Actualizar
    public Carreras actualizar(Carreras carreras) {
        return carrerasRepository.save(carreras);
    }
}
