package tp_hotel.tp_hotel.strategy;

import java.util.HashMap;
import java.util.Map;

import tp_hotel.tp_hotel.model.TipoReglaPrecio;
import tp_hotel.tp_hotel.strategy.impl.*;

public class PrecioStrategyFactory {

    private static final Map<TipoReglaPrecio, EstrategiaPrecio> estrategias = new HashMap<>();

    static {
        estrategias.put(TipoReglaPrecio.TEMPORADA_ALTA, new TemporadaAltaEstrategia());
        estrategias.put(TipoReglaPrecio.FIN_DE_SEMANA, new FinDeSemanaEstrategia());
        estrategias.put(TipoReglaPrecio.OCUPACION_ALTA, new OcupacionAltaEstrategia());
        estrategias.put(TipoReglaPrecio.DESCUENTO_ESTADIA_LARGA, new EstadiaLargaEstrategia());
    }

    public static EstrategiaPrecio getStrategy(TipoReglaPrecio tipo) {
        EstrategiaPrecio strategy = estrategias.get(tipo);
        if (strategy == null) {
            throw new IllegalArgumentException("No existe estrategia de precio para: " + tipo);
        }
        return strategy;
    }
}
