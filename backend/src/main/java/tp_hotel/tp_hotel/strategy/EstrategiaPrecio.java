package tp_hotel.tp_hotel.strategy;

import java.time.LocalDate;

import tp_hotel.tp_hotel.model.ReglaPrecio;

public interface EstrategiaPrecio {
    boolean aplica(ReglaPrecio regla, LocalDate desde, LocalDate hasta, float ocupacionActual);
    float calcularPrecio(float precioBase, ReglaPrecio regla);
}
