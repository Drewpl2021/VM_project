package org.example.projectvm.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Inscripciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "eventos_id", nullable = false)
    private Evento evento;

    @ManyToOne
    @JoinColumn(name = "usuarios_id", nullable = false)
    private User usuario;
}
