package tp_hotel.tp_hotel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tp_hotel.tp_hotel.exceptions.EstadiaNoExistenteException;
import tp_hotel.tp_hotel.exceptions.TokenInvalidoException;
import tp_hotel.tp_hotel.model.PortalHuespedDTO;
import tp_hotel.tp_hotel.service.GestorPortalHuesped;

@RestController
@RequestMapping("/api/portal")
@CrossOrigin(origins = "*")
public class PortalHuespedController {

    private final GestorPortalHuesped gestorPortalHuesped;

    @Autowired
    public PortalHuespedController(GestorPortalHuesped gestorPortalHuesped) {
        this.gestorPortalHuesped = gestorPortalHuesped;
    }

    @PostMapping("/generar/{estadiaId}")
    public ResponseEntity<?> generarToken(@PathVariable Integer estadiaId) {
        try {
            String token = gestorPortalHuesped.generarToken(estadiaId);
            return ResponseEntity.status(HttpStatus.CREATED).body(token);
        } catch (EstadiaNoExistenteException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/huesped/{token}")
    public ResponseEntity<?> obtenerDatosPortal(@PathVariable String token) {
        try {
            PortalHuespedDTO datos = gestorPortalHuesped.obtenerDatosPortal(token);
            return ResponseEntity.status(HttpStatus.OK).body(datos);
        } catch (TokenInvalidoException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/invalidar/{token}")
    public ResponseEntity<?> invalidarToken(@PathVariable String token) {
        try {
            gestorPortalHuesped.invalidarToken(token);
            return ResponseEntity.status(HttpStatus.OK).body("Token invalidado correctamente");
        } catch (TokenInvalidoException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
