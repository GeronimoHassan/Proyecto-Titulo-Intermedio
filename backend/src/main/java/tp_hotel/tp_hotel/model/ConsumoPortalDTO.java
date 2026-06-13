package tp_hotel.tp_hotel.model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsumoPortalDTO {

    private String descripcion;
    private Float monto;
    private LocalDate fecha;

    public ConsumoPortalDTO(Consumo consumo) {
        this.descripcion = consumo.getCantidad() != null && consumo.getCantidad() > 1
                ? consumo.getDescripcion() + " (x" + consumo.getCantidad() + ")"
                : consumo.getDescripcion();
        this.monto = consumo.getMonto() * (consumo.getCantidad() != null ? consumo.getCantidad() : 1);
        this.fecha = consumo.getFecha();
    }
}
