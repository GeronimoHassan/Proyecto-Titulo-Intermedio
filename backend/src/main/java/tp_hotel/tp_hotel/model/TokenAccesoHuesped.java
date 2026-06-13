package tp_hotel.tp_hotel.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "token_acceso_huesped")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenAccesoHuesped {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String token;

    @ManyToOne
    @JoinColumn(name = "estadia_id", nullable = false)
    private Estadia estadia;

    @Column(nullable = false)
    private LocalDate fechaCreacion;

    @Column(nullable = false)
    private Boolean activo = true;
}
