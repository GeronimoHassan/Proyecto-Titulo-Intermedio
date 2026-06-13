package tp_hotel.tp_hotel.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tp_hotel.tp_hotel.model.CotizacionResponseDTO;
import tp_hotel.tp_hotel.model.Habitacion;
import tp_hotel.tp_hotel.model.PrecioCalculado;
import tp_hotel.tp_hotel.model.ReglaPrecio;
import tp_hotel.tp_hotel.model.ReglaPrecioDTO;
import tp_hotel.tp_hotel.repository.HabitacionRepository;
import tp_hotel.tp_hotel.repository.ReglaPrecioRepository;

@Service
public class GestorPrecio {

    private final PrecioEngine precioEngine;
    private final ReglaPrecioRepository reglaPrecioRepository;
    private final HabitacionRepository habitacionRepository;

    @Autowired
    public GestorPrecio(PrecioEngine precioEngine, ReglaPrecioRepository reglaPrecioRepository,
                        HabitacionRepository habitacionRepository) {
        this.precioEngine = precioEngine;
        this.reglaPrecioRepository = reglaPrecioRepository;
        this.habitacionRepository = habitacionRepository;
    }

    public PrecioCalculado cotizar(Habitacion habitacion, LocalDate desde, LocalDate hasta) {
        if (desde == null || hasta == null || !hasta.isAfter(desde)) {
            throw new IllegalArgumentException("La fecha hasta debe ser posterior a la fecha desde");
        }
        return precioEngine.calcular(habitacion, desde, hasta);
    }

    public CotizacionResponseDTO cotizar(String numeroHabitacion, LocalDate desde, LocalDate hasta) {
        Habitacion habitacion = habitacionRepository.findById(numeroHabitacion)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No existe la habitación con número: " + numeroHabitacion));

        PrecioCalculado precio = cotizar(habitacion, desde, hasta);

        return new CotizacionResponseDTO(
                habitacion.getNumero(),
                habitacion.getCategoria(),
                precio.getPrecioNocheBase(),
                precio.getPrecioNocheAjustado(),
                precio.getNoches(),
                precio.getTotalFinal(),
                precio.getOcupacionActual(),
                precio.getReglasAplicadas());
    }

    public ReglaPrecio crearRegla(ReglaPrecioDTO dto) {
        ReglaPrecio regla = new ReglaPrecio();
        regla.setNombre(dto.getNombre());
        regla.setDescripcion(dto.getDescripcion());
        regla.setTipo(dto.getTipo());
        regla.setMultiplicador(dto.getMultiplicador());
        regla.setUmbralOcupacion(dto.getUmbralOcupacion());
        regla.setFechaDesde(dto.getFechaDesde());
        regla.setFechaHasta(dto.getFechaHasta());
        regla.setMinNoches(dto.getMinNoches());
        regla.setActiva(dto.getActiva());
        regla.setPrioridad(dto.getPrioridad());
        return reglaPrecioRepository.save(regla);
    }

    public List<ReglaPrecio> listarReglas() {
        return reglaPrecioRepository.findAll();
    }

    public ReglaPrecio activar(Long id) {
        return cambiarEstado(id, true);
    }

    public ReglaPrecio desactivar(Long id) {
        return cambiarEstado(id, false);
    }

    private ReglaPrecio cambiarEstado(Long id, boolean activa) {
        ReglaPrecio regla = reglaPrecioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No existe la regla de precio con id: " + id));
        regla.setActiva(activa);
        return reglaPrecioRepository.save(regla);
    }
}
