package tp_hotel.tp_hotel.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import tp_hotel.tp_hotel.model.CotizacionResponseDTO;
import tp_hotel.tp_hotel.model.ReglaPrecio;
import tp_hotel.tp_hotel.model.ReglaPrecioDTO;
import tp_hotel.tp_hotel.service.GestorPrecio;

@RestController
@RequestMapping("/api/precios")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class PrecioController {

    private final GestorPrecio gestorPrecio;

    @Autowired
    public PrecioController(GestorPrecio gestorPrecio) {
        this.gestorPrecio = gestorPrecio;
    }

    @GetMapping("/cotizar/{numeroHabitacion}")
    public ResponseEntity<?> cotizar(
            @PathVariable String numeroHabitacion,
            @RequestParam(required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        try {
            CotizacionResponseDTO cotizacion = gestorPrecio.cotizar(numeroHabitacion, desde, hasta);
            return ResponseEntity.status(HttpStatus.OK).body(cotizacion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reglas")
    public ResponseEntity<?> crearRegla(@Valid @RequestBody ReglaPrecioDTO dto) {
        try {
            ReglaPrecio regla = gestorPrecio.crearRegla(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(regla);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/reglas")
    public ResponseEntity<List<ReglaPrecio>> listarReglas() {
        return ResponseEntity.status(HttpStatus.OK).body(gestorPrecio.listarReglas());
    }

    @PatchMapping("/reglas/{id}/activar")
    public ResponseEntity<?> activar(@PathVariable Long id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(gestorPrecio.activar(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/reglas/{id}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(gestorPrecio.desactivar(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
