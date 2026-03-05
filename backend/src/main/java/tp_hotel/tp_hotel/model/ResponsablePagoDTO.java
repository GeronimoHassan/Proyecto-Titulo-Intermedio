package tp_hotel.tp_hotel.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponsablePagoDTO {
    
    private Integer id;
    private String razonSocial;
    private String cuit;
    private String telefono;
    private String tipo;

    public ResponsablePagoDTO(ResponsablePago responsablePago){
        this.id = responsablePago.getId();
        this.razonSocial = responsablePago.getRazonSocial();
        this.cuit = responsablePago.getCUIT();
        if (responsablePago instanceof PersonaJuridica pj) {
            this.telefono = pj.getTelefono();
            this.tipo = "JURIDICA";
        } else {
            this.tipo = "FISICA";
        }
    }
}