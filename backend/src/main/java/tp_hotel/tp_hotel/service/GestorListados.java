package tp_hotel.tp_hotel.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tp_hotel.tp_hotel.exceptions.FechaDesdePosteriorHastaException;
import tp_hotel.tp_hotel.model.ChequeDTO;
import tp_hotel.tp_hotel.model.IngresoDTO;
import tp_hotel.tp_hotel.model.Pago;
import tp_hotel.tp_hotel.model.TipoPago;
import tp_hotel.tp_hotel.repository.PagoChequeRepository;
import tp_hotel.tp_hotel.repository.PagoRepository;

@Service
public class GestorListados {

    private final PagoChequeRepository pagoChequeRepository;
    private final PagoRepository pagoRepository;

    @Autowired
    public GestorListados(PagoChequeRepository pagoChequeRepository, PagoRepository pagoRepository) {
        this.pagoChequeRepository = pagoChequeRepository;
        this.pagoRepository = pagoRepository;
    }

    public List<ChequeDTO> listarCheques(LocalDate desde, LocalDate hasta) {
        if (desde.isAfter(hasta)) {
            throw new FechaDesdePosteriorHastaException("La fecha 'desde' no puede ser posterior a la fecha 'hasta'.");
        }
        return pagoChequeRepository.findByFechaCobroBetween(desde, hasta)
                .stream()
                .map(ChequeDTO::new)
                .collect(Collectors.toList());
    }

    public List<IngresoDTO> listarIngresos(LocalDate desde, LocalDate hasta) {
        if (desde.isAfter(hasta)) {
            throw new FechaDesdePosteriorHastaException("La fecha 'desde' no puede ser posterior a la fecha 'hasta'.");
        }
        List<Pago> pagos = pagoRepository.findByFechaBetween(desde, hasta);
        List<IngresoDTO> ingresos = new ArrayList<>();
        for (Pago pago : pagos) {
            for (TipoPago tp : pago.getFormasDePago()) {
                ingresos.add(new IngresoDTO(pago.getFecha(), tp));
            }
        }
        return ingresos;
    }
}
