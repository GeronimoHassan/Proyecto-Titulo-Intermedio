package tp_hotel.tp_hotel.model;

import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChequeDTO {
    private String numero;
    private String banco;
    private String plaza;
    private Float monto;
    private LocalDate fechaCobro;

    public ChequeDTO(PagoCheque cheque) {
        this.numero = cheque.getNumero();
        this.banco = cheque.getBanco();
        this.plaza = cheque.getPlaza();
        this.monto = cheque.getImporte();
        this.fechaCobro = cheque.getFechaCobro();
    }
}
