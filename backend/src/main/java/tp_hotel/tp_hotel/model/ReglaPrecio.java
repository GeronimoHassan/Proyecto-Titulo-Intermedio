package tp_hotel.tp_hotel.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "regla_precio")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReglaPrecio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoReglaPrecio tipo;

    @Column(nullable = false)
    private Float multiplicador;

    private Float umbralOcupacion;

    private LocalDate fechaDesde;

    private LocalDate fechaHasta;

    private Integer minNoches;

    @Column(nullable = false)
    private Boolean activa;

    @Column(nullable = false)
    private Integer prioridad;
}
