package tp_hotel.tp_hotel.model;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReglaPrecioDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El tipo de regla es obligatorio")
    private TipoReglaPrecio tipo;

    @NotNull(message = "El multiplicador es obligatorio")
    private Float multiplicador;

    private Float umbralOcupacion;

    private LocalDate fechaDesde;

    private LocalDate fechaHasta;

    private Integer minNoches;

    @NotNull(message = "El campo activa es obligatorio")
    private Boolean activa;

    @NotNull(message = "La prioridad es obligatoria")
    private Integer prioridad;
}
