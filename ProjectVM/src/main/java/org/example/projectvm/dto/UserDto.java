package org.example.projectvm.dto;

import lombok.Data;

@Data
public class UserDto {
    private String nombre;
    private String apellido;
    private String dni;
    private String codigo;
    private String email;
    private String password;
    private String privateIngreso;
    private int horasObtenidas;
    private String status;
    private Integer carrerasId; // ID de la carrera
    private Integer rolesId;   // ID del rol

    // Getters y setters
}
