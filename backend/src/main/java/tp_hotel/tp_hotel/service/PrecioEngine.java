package tp_hotel.tp_hotel.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tp_hotel.tp_hotel.model.Habitacion;
import tp_hotel.tp_hotel.model.PrecioCalculado;
import tp_hotel.tp_hotel.model.ReglaPrecio;
import tp_hotel.tp_hotel.repository.EstadiaRepository;
import tp_hotel.tp_hotel.repository.ReglaPrecioRepository;
import tp_hotel.tp_hotel.strategy.EstrategiaPrecio;
import tp_hotel.tp_hotel.strategy.PrecioStrategyFactory;

@Service
public class PrecioEngine {

    private static final int TOTAL_HABITACIONES = 48;

    private final ReglaPrecioRepository reglaPrecioRepository;
    private final EstadiaRepository estadiaRepository;

    @Autowired
    public PrecioEngine(ReglaPrecioRepository reglaPrecioRepository, EstadiaRepository estadiaRepository) {
        this.reglaPrecioRepository = reglaPrecioRepository;
        this.estadiaRepository = estadiaRepository;
    }

    public PrecioCalculado calcular(Habitacion habitacion, LocalDate desde, LocalDate hasta) {
        long noches = ChronoUnit.DAYS.between(desde, hasta);
        float ocupacionActual = calcularOcupacion(desde, hasta);

        List<ReglaPrecio> reglasActivas = reglaPrecioRepository.findByActivaTrueOrderByPrioridadDesc();

        float precioNocheBase = habitacion.getCostoNoche();
        float precioNocheAjustado = precioNocheBase;
        List<String> reglasAplicadas = new ArrayList<>();

        for (ReglaPrecio regla : reglasActivas) {
            EstrategiaPrecio estrategia = PrecioStrategyFactory.getStrategy(regla.getTipo());
            if (estrategia.aplica(regla, desde, hasta, ocupacionActual)) {
                precioNocheAjustado = estrategia.calcularPrecio(precioNocheAjustado, regla);
                reglasAplicadas.add(regla.getNombre());
            }
        }

        float totalFinal = precioNocheAjustado * noches;

        return new PrecioCalculado(precioNocheBase, precioNocheAjustado, totalFinal,
                noches, ocupacionActual, reglasAplicadas);
    }

    private float calcularOcupacion(LocalDate desde, LocalDate hasta) {
        long habitacionesOcupadas = estadiaRepository.findEstadiasPorFecha(desde, hasta).stream()
                .map(estadia -> estadia.getHabitacion().getNumero())
                .distinct()
                .count();
        return (float) habitacionesOcupadas / TOTAL_HABITACIONES;
    }
}
