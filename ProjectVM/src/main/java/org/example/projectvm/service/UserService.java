package org.example.projectvm.service;

import org.example.projectvm.entity.User;
import org.example.projectvm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    // Obtener un usuario por Dni
    public Optional<User> buscarPorDni(String dni) {
        return userRepository.findByDni(dni);
    }

    // Obtener un usuario por Codigo
    public Optional<User> buscarPorCodigo(String codigo) {
        return userRepository.findByCodigo(codigo);
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
