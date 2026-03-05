package tp_hotel.tp_hotel.model;

import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class IngresoDTO {
    private LocalDate fecha;
    private String metodoPago;
    private Float monto;
    private String tipoMoneda;

    public IngresoDTO(LocalDate fecha, TipoPago tp) {
        this.fecha = fecha;
        this.metodoPago = tp.getMetodoPago().name();
        this.monto = tp.getImporte();
        if (tp instanceof PagoMoneda pm) {
            this.tipoMoneda = pm.getMoneda() != null ? pm.getMoneda().name() : "ARS";
        } else {
            this.tipoMoneda = "ARS";
        }
    }
}
