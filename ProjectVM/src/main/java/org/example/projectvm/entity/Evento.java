package org.example.projectvm.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private String direccion;
    private String lugar;
    private Date fecha_inicio;
    private Date fecha_fin;
    private String hora;
    private String horas_obtenidas;
    @Enumerated(EnumType.STRING)
    private Evento.Status status;
    public enum Status {
        Activo,
        Finalizado,
    }
    private String anio;


}
