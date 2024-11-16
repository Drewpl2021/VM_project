package org.example.projectvm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private String apellido;
    private String dni;
    private String codigo;
    private String email;
    private String password;
    private String private_ingreso;
    private Integer horas_obtenidas;
    @Enumerated(EnumType.STRING)
    private Status status;
    public enum Status {
        Estudiante,
        Egresado,
        Docente

    }

    @ManyToOne
    @JoinColumn(name = "roles_id", nullable = false)
    private Roles rol;

    @ManyToOne
    @JoinColumn(name = "carreras_id", nullable = false)
    private Carreras  carrera;

}
