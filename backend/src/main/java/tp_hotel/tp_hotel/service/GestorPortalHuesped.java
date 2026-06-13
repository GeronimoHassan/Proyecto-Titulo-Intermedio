package tp_hotel.tp_hotel.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tp_hotel.tp_hotel.exceptions.EstadiaNoExistenteException;
import tp_hotel.tp_hotel.exceptions.TokenInvalidoException;
import tp_hotel.tp_hotel.model.ConsumoPortalDTO;
import tp_hotel.tp_hotel.model.Estadia;
import tp_hotel.tp_hotel.model.EstadoFactura;
import tp_hotel.tp_hotel.model.Factura;
import tp_hotel.tp_hotel.model.Huesped;
import tp_hotel.tp_hotel.model.PortalHuespedDTO;
import tp_hotel.tp_hotel.model.TokenAccesoHuesped;
import tp_hotel.tp_hotel.repository.EstadiaRepository;
import tp_hotel.tp_hotel.repository.TokenAccesoHuespedRepository;

@Service
public class GestorPortalHuesped {

    private final TokenAccesoHuespedRepository tokenAccesoHuespedRepository;
    private final EstadiaRepository estadiaRepository;

    @Autowired
    public GestorPortalHuesped(TokenAccesoHuespedRepository tokenAccesoHuespedRepository,
                               EstadiaRepository estadiaRepository) {
        this.tokenAccesoHuespedRepository = tokenAccesoHuespedRepository;
        this.estadiaRepository = estadiaRepository;
    }

    public String generarToken(Integer estadiaId) {
        Estadia estadia = estadiaRepository.findById(estadiaId)
                .orElseThrow(() -> new EstadiaNoExistenteException(
                        "No existe la estadía con id: " + estadiaId));

        TokenAccesoHuesped tokenAcceso = new TokenAccesoHuesped();
        tokenAcceso.setToken(UUID.randomUUID().toString());
        tokenAcceso.setEstadia(estadia);
        tokenAcceso.setFechaCreacion(LocalDate.now());
        tokenAcceso.setActivo(true);

        return tokenAccesoHuespedRepository.save(tokenAcceso).getToken();
    }

    @Transactional(readOnly = true)
    public PortalHuespedDTO obtenerDatosPortal(String token) {
        TokenAccesoHuesped tokenAcceso = tokenAccesoHuespedRepository.findByTokenAndActivoTrue(token)
                .orElseThrow(() -> new TokenInvalidoException("El token es inválido o fue dado de baja"));

        Estadia estadia = tokenAcceso.getEstadia();
        Huesped titular = estadia.getHuespedTitular();

        PortalHuespedDTO dto = new PortalHuespedDTO();
        dto.setNumeroHabitacion(estadia.getHabitacion().getNumero());
        dto.setCategoriaHabitacion(estadia.getHabitacion().getCategoria().name());
        dto.setCheckIn(estadia.getCheckIn());
        dto.setCheckOut(estadia.getCheckOut());
        dto.setNombreTitular(titular.getNombres() + " " + titular.getApellido());

        // Una estadía puede tener varias facturas: se acumulan las no anuladas.
        List<Factura> facturas = estadia.getFacturas().stream()
                .filter(f -> f.getEstado() != EstadoFactura.ANULADA)
                .collect(Collectors.toList());

        float totalFactura = 0f;
        float totalPagado = 0f;
        for (Factura factura : facturas) {
            totalFactura += factura.getTotal();
            if (factura.getPago() != null && factura.getPago().getMontoTotal() != null) {
                totalPagado += factura.getPago().getMontoTotal();
            }
        }
        dto.setTotalFactura(totalFactura);
        dto.setTotalPagado(totalPagado);
        dto.setSaldoPendiente(totalFactura - totalPagado);

        if (facturas.isEmpty()) {
            dto.setEstadoFactura("SIN_FACTURA");
        } else if (facturas.stream().allMatch(f -> f.getEstado() == EstadoFactura.PAGADA)) {
            dto.setEstadoFactura(EstadoFactura.PAGADA.name());
        } else {
            dto.setEstadoFactura(EstadoFactura.PENDIENTE.name());
        }

        dto.setConsumos(estadia.getConsumos().stream()
                .map(ConsumoPortalDTO::new)
                .collect(Collectors.toList()));

        return dto;
    }

    public void invalidarToken(String token) {
        TokenAccesoHuesped tokenAcceso = tokenAccesoHuespedRepository.findByTokenAndActivoTrue(token)
                .orElseThrow(() -> new TokenInvalidoException("El token es inválido o ya fue dado de baja"));
        tokenAcceso.setActivo(false);
        tokenAccesoHuespedRepository.save(tokenAcceso);
    }
}
