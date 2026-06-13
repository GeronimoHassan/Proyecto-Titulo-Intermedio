package tp_hotel.tp_hotel.strategy.impl;

import java.time.DayOfWeek;
import java.time.LocalDate;

import tp_hotel.tp_hotel.model.ReglaPrecio;
import tp_hotel.tp_hotel.strategy.EstrategiaPrecio;

public class FinDeSemanaEstrategia implements EstrategiaPrecio {

    @Override
    public boolean aplica(ReglaPrecio regla, LocalDate desde, LocalDate hasta, float ocupacionActual) {
        for (LocalDate noche = desde; noche.isBefore(hasta); noche = noche.plusDays(1)) {
            DayOfWeek dia = noche.getDayOfWeek();
            if (dia == DayOfWeek.FRIDAY || dia == DayOfWeek.SATURDAY) {
                return true;
            }
        }
        return false;
    }

    @Override
    public float calcularPrecio(float precioBase, ReglaPrecio regla) {
        return precioBase * regla.getMultiplicador();
    }
}
