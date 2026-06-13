package tp_hotel.tp_hotel.strategy.impl;

import java.time.LocalDate;

import tp_hotel.tp_hotel.model.ReglaPrecio;
import tp_hotel.tp_hotel.strategy.EstrategiaPrecio;

public class TemporadaAltaEstrategia implements EstrategiaPrecio {

    @Override
    public boolean aplica(ReglaPrecio regla, LocalDate desde, LocalDate hasta, float ocupacionActual) {
        if (regla.getFechaDesde() == null || regla.getFechaHasta() == null) {
            return false;
        }
        return !desde.isAfter(regla.getFechaHasta()) && !hasta.isBefore(regla.getFechaDesde());
    }

    @Override
    public float calcularPrecio(float precioBase, ReglaPrecio regla) {
        return precioBase * regla.getMultiplicador();
    }
}
