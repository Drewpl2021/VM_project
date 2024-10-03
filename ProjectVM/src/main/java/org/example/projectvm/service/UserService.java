package org.example.projectvm.service;

import org.example.projectvm.entity.User;
import org.example.projectvm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    // Listar todos los usuarios
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    // Obtener un usuario por ID
    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    // Crear un nuevo usuario
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Eliminar un usuario por ID
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    //Actualizar clientes
    public User actualizar(User user) {
        return userRepository.save(user);
    }

}
