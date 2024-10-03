package org.example.projectvm.service;


import org.example.projectvm.entity.Roles;
import org.example.projectvm.repository.RolesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RolesService {

    @Autowired
    private RolesRepository rolesRepository;

    // Listar todos
    public List<Roles> getAll() {
        return rolesRepository.findAll();
    }
    // Obtener por ID
    public Optional<Roles> getById(Integer id) {
        return rolesRepository.findById(id);
    }

    // Crear
    public Roles create(Roles roles) {
        return rolesRepository.save(roles);
    }

    // Eliminar
    public void delete(Integer id) {
        rolesRepository.deleteById(id);
    }

    //Actualizar
    public Roles actualizar(Roles roles) {
        return rolesRepository.save(roles);
    }
}
