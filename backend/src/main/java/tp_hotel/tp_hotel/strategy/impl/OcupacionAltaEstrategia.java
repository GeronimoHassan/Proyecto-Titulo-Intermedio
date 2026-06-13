package tp_hotel.tp_hotel.strategy.impl;

import java.time.LocalDate;

import tp_hotel.tp_hotel.model.ReglaPrecio;
import tp_hotel.tp_hotel.strategy.EstrategiaPrecio;

public class OcupacionAltaEstrategia implements EstrategiaPrecio {

    @Override
    public boolean aplica(ReglaPrecio regla, LocalDate desde, LocalDate hasta, float ocupacionActual) {
        if (regla.getUmbralOcupacion() == null) {
            return false;
        }
        return ocupacionActual >= regla.getUmbralOcupacion();
    }

    @Override
    public float calcularPrecio(float precioBase, ReglaPrecio regla) {
        return precioBase * regla.getMultiplicador();
    }
}
