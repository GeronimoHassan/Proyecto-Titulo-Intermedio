package tp_hotel.tp_hotel.strategy.impl;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import tp_hotel.tp_hotel.model.ReglaPrecio;
import tp_hotel.tp_hotel.strategy.EstrategiaPrecio;

public class EstadiaLargaEstrategia implements EstrategiaPrecio {

    @Override
    public boolean aplica(ReglaPrecio regla, LocalDate desde, LocalDate hasta, float ocupacionActual) {
        if (regla.getMinNoches() == null) {
            return false;
        }
        long noches = ChronoUnit.DAYS.between(desde, hasta);
        return noches >= regla.getMinNoches();
    }

    @Override
    public float calcularPrecio(float precioBase, ReglaPrecio regla) {
        return precioBase * regla.getMultiplicador();
    }
}
