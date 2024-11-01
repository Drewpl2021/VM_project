package org.example.projectvm.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.projectvm.entity.Carreras;
import org.example.projectvm.entity.Roles;
import org.example.projectvm.entity.User;
import org.example.projectvm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
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

    // Crear un nuevo usuario
    public User createUser(User user) {return userRepository.save(user);}


    // Eliminar un usuario por ID
    public void deleteUser(Integer id) {userRepository.deleteById(id);}

    //Actualizar clientes
    public User actualizar(User user) {return userRepository.save(user);}




    public List<String> saveUsersFromExcel(MultipartFile file) throws Exception {
        List<User> usersToSave = new ArrayList<>();
        List<String> mensajesOmitidos = new ArrayList<>();

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);

                if (row == null) continue;

                String dni = getCellValueAsString(row.getCell(2));
                String codigo = getCellValueAsString(row.getCell(3));

                if (userRepository.existsByDni(dni) || userRepository.existsByCodigo(codigo)) {
                    mensajesOmitidos.add("Fila " + (i + 1) + " omitida: DNI o código ya existen.");
                    continue;
                }

                User user = new User();
                user.setNombre(getCellValueAsString(row.getCell(0)));
                user.setApellido(getCellValueAsString(row.getCell(1)));
                user.setDni(dni);
                user.setCodigo(codigo);
                user.setEmail(getCellValueAsString(row.getCell(4)));
                user.setPassword(getCellValueAsString(row.getCell(5)));
                user.setPrivate_ingreso(getCellValueAsString(row.getCell(6)));
                user.setHoras_obtenidas((int) row.getCell(7).getNumericCellValue());
                user.setStatus(User.Status.valueOf(getCellValueAsString(row.getCell(8))));

                Carreras carrera = new Carreras();
                carrera.setId((int) row.getCell(9).getNumericCellValue());
                user.setCarrera(carrera);

                Roles rol = new Roles();
                rol.setId((int) row.getCell(10).getNumericCellValue());
                user.setRol(rol);

                usersToSave.add(user);
            }
        }

        userRepository.saveAll(usersToSave);

        return mensajesOmitidos;
    }

    // Método auxiliar para obtener el valor de una celda como String
    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue();
        } else if (cell.getCellType() == CellType.NUMERIC) {
            return String.valueOf((int) cell.getNumericCellValue());  // Convertir numérico a String
        } else {
            return cell.toString();  // Para cualquier otro tipo de celda
        }
    }


}
