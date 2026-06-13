package tp_hotel.tp_hotel.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortalHuespedDTO {

    private String numeroHabitacion;
    private String categoriaHabitacion;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String nombreTitular;
    private Float totalFactura;
    private Float totalPagado;
    private Float saldoPendiente;
    private String estadoFactura;
    private List<ConsumoPortalDTO> consumos = new ArrayList<>();
}
