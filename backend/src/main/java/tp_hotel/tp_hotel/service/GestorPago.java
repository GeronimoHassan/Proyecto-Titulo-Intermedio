package tp_hotel.tp_hotel.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import tp_hotel.tp_hotel.model.EstadoFactura;
import tp_hotel.tp_hotel.model.Factura;
import tp_hotel.tp_hotel.model.Pago;
import tp_hotel.tp_hotel.model.TipoPago;
import tp_hotel.tp_hotel.model.TipoPagoDTO;
import tp_hotel.tp_hotel.repository.FacturaRepository;
import tp_hotel.tp_hotel.repository.PagoRepository;
import tp_hotel.tp_hotel.strategy.StrategyFactory;
import tp_hotel.tp_hotel.exceptions.FacturaPagadaException;
import tp_hotel.tp_hotel.exceptions.PagoInsuficienteException;
import tp_hotel.tp_hotel.exceptions.TipoPagoIncorrectoException;
import tp_hotel.tp_hotel.factory.TipoPagoFactory;

@Service
public class GestorPago{

    private final PagoRepository pagoRepository;
    private final GestorFacturacion gestorFacturacion;
    private final FacturaRepository facturaRepository;

    @Autowired
    public GestorPago(GestorFacturacion gestorFacturacion, PagoRepository pagoRepository, FacturaRepository facturaRepository) {
        this.gestorFacturacion = gestorFacturacion;
        this.pagoRepository = pagoRepository;
        this.facturaRepository = facturaRepository;
    }

    public void registrarPago(Factura f, TipoPago p) {
    }

    public List<Factura> obtenerFacturasPendientes(int habitacion) {
        return facturaRepository.findByNumeroHabitacionYEstado(String.valueOf(habitacion), EstadoFactura.PENDIENTE);
    }

    public Float calcularVuelto(Float total, List<TipoPago> pagos) {
        Float sumaPagos = 0.0f;
        for (TipoPago pago : pagos) {
            sumaPagos += pago.getImporte();
        }

        Float vuelto = sumaPagos - total;
        return vuelto > 0 ? vuelto : 0.0f;
    }

    @Transactional
    public Pago ingresarPago(List<TipoPagoDTO> tipoPagoEntrante, Integer facturaId) {
        List<TipoPago> tiposPago = tipoPagoEntrante.stream().map(TipoPagoFactory::crearTipoPago).toList();
        for(TipoPago tp : tiposPago){
            boolean validacionCorrecta = StrategyFactory.getStrategy(tp.getMetodoPago()).validar(tp);
            if(!validacionCorrecta){
                throw new TipoPagoIncorrectoException("El tipo de pago ingresado es incorrecto.");
            }
        }
        
        Factura factura = gestorFacturacion.obtenerFacturaPorId(facturaId);
        
        if(factura.getEstado() == EstadoFactura.PAGADA){
            throw new FacturaPagadaException("La factura " + facturaId + " ya se encuentra pagada.");
        }

        Pago pago = new Pago();
        pago.setFecha(LocalDate.now());
        pago.setFactura(factura);
        pago.setFormasDePago(tiposPago);
        pago.calcularMontoTotal();
        
        if(pago.getMontoTotal() < factura.getTotal()){
            throw new PagoInsuficienteException("El monto del pago " + pago.getMontoTotal() + 
            ", es insuficiente para pagar el importe de la factura " + factura.getTotal());
        }
        factura.setEstado(EstadoFactura.PAGADA);
        pagoRepository.save(pago);

        return pago;
    }
}