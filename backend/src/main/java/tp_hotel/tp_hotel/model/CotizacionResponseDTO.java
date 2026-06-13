package tp_hotel.tp_hotel.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CotizacionResponseDTO {

    private String numeroHabitacion;
    private CategoriaHabitacion categoria;
    private float precioNocheBase;
    private float precioNocheAjustado;
    private long noches;
    private float totalFinal;
    private float porcentajeOcupacion;
    private List<String> reglasAplicadas;
}
