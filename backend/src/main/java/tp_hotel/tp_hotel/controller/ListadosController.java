package tp_hotel.tp_hotel.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tp_hotel.tp_hotel.exceptions.FechaDesdePosteriorHastaException;
import tp_hotel.tp_hotel.model.ChequeDTO;
import tp_hotel.tp_hotel.model.IngresoDTO;
import tp_hotel.tp_hotel.service.GestorListados;

@RestController
@RequestMapping("/api/listados")
@CrossOrigin(origins = "http://localhost:3000")
public class ListadosController {

    private final GestorListados gestorListados;

    @Autowired
    public ListadosController(GestorListados gestorListados) {
        this.gestorListados = gestorListados;
    }

    @GetMapping("/cheques")
    public ResponseEntity<?> listarCheques(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        try {
            List<ChequeDTO> cheques = gestorListados.listarCheques(desde, hasta);
            return ResponseEntity.ok(cheques);
        } catch (FechaDesdePosteriorHastaException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/ingresos")
    public ResponseEntity<?> listarIngresos(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        try {
            List<IngresoDTO> ingresos = gestorListados.listarIngresos(desde, hasta);
            return ResponseEntity.ok(ingresos);
        } catch (FechaDesdePosteriorHastaException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
