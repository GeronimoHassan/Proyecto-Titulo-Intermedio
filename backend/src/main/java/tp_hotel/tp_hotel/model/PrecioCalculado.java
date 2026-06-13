package tp_hotel.tp_hotel.model;

import java.util.Collections;
import java.util.List;

public class PrecioCalculado {

    private final float precioNocheBase;
    private final float precioNocheAjustado;
    private final float totalFinal;
    private final long noches;
    private final float ocupacionActual;
    private final List<String> reglasAplicadas;

    public PrecioCalculado(float precioNocheBase, float precioNocheAjustado, float totalFinal,
                           long noches, float ocupacionActual, List<String> reglasAplicadas) {
        this.precioNocheBase = precioNocheBase;
        this.precioNocheAjustado = precioNocheAjustado;
        this.totalFinal = totalFinal;
        this.noches = noches;
        this.ocupacionActual = ocupacionActual;
        this.reglasAplicadas = Collections.unmodifiableList(reglasAplicadas);
    }

    public float getPrecioNocheBase() {
        return precioNocheBase;
    }

    public float getPrecioNocheAjustado() {
        return precioNocheAjustado;
    }

    public float getTotalFinal() {
        return totalFinal;
    }

    public long getNoches() {
        return noches;
    }

    public float getOcupacionActual() {
        return ocupacionActual;
    }

    public List<String> getReglasAplicadas() {
        return reglasAplicadas;
    }
}
