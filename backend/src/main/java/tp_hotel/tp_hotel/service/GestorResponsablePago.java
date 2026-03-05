package tp_hotel.tp_hotel.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tp_hotel.tp_hotel.exceptions.CuitYaExistenteException;
import tp_hotel.tp_hotel.exceptions.FacturaAsociadaException;
import tp_hotel.tp_hotel.exceptions.HuespedNoEncontradoException;
import tp_hotel.tp_hotel.exceptions.PersonaJuridicaNoExistenteException;
import tp_hotel.tp_hotel.exceptions.ResponsablePagoNoExistenteException;
import tp_hotel.tp_hotel.model.BusquedaResponsablePagoDTO;
import tp_hotel.tp_hotel.model.Huesped;
import tp_hotel.tp_hotel.model.PersonaFisica;
import tp_hotel.tp_hotel.model.PersonaJuridica;
import tp_hotel.tp_hotel.model.PersonaJuridicaDTO;
import tp_hotel.tp_hotel.model.ResponsablePago;
import tp_hotel.tp_hotel.repository.HuespedRepository;
import tp_hotel.tp_hotel.repository.PersonaFisicaRepository;
import tp_hotel.tp_hotel.repository.PersonaJuridicaRepository;
import tp_hotel.tp_hotel.repository.ResponsablePagoRepository;

@Service
public class GestorResponsablePago {

    private final HuespedRepository huespedRepository;
    private final PersonaJuridicaRepository personaJuridicaRepository;
    private final PersonaFisicaRepository personaFisicaRepository;
    private final ResponsablePagoRepository responsablePagoRepository;

    @Autowired
    public GestorResponsablePago(PersonaJuridicaRepository personaJuridicaRepository, PersonaFisicaRepository personaFisicaRepository, 
            HuespedRepository huespedRepository, ResponsablePagoRepository responsablePagoRepository) {
        this.personaJuridicaRepository = personaJuridicaRepository;
        this.personaFisicaRepository = personaFisicaRepository;
        this.huespedRepository = huespedRepository;
        this.responsablePagoRepository = responsablePagoRepository;
    }

    public boolean cuitUnico(String cuit) {
        Optional<PersonaJuridica> personaJuridica = personaJuridicaRepository.findByCuit(cuit);
        return personaJuridica.isEmpty();
    }   
    
    public List<PersonaJuridica> buscarPersonaJuridica(BusquedaResponsablePagoDTO busquedaResponsablePagoDTO) {
        String cuit = busquedaResponsablePagoDTO.getCuit();
        String razonSocial = busquedaResponsablePagoDTO.getRazonSocial();
        
        List<PersonaJuridica> responsables = personaJuridicaRepository.findByCuitYRazonSocial(cuit, razonSocial);
        
        if(responsables.isEmpty()){
            throw new PersonaJuridicaNoExistenteException("No se encontró un responsable pago para los atributos proporcionados.");
        }

        return responsables;
    }
    
    public ResponsablePago darAltaPersonaFisica(Integer idHuesped) {
        Optional<PersonaFisica> personaFisica = personaFisicaRepository.findByHuespedId(idHuesped);

        if(personaFisica.isPresent()) return personaFisica.get();

        Optional<Huesped> huesped = huespedRepository.findById(idHuesped);
        if(!huesped.isPresent()) {
            throw new HuespedNoEncontradoException("No se encontró un huésped con el identificador proporcionado.");
        }
        PersonaFisica personaFisicaNueva = new PersonaFisica();
        personaFisicaNueva.setRazonSocial(huesped.get().getApellido() + " " + huesped.get().getNombres());
        personaFisicaNueva.setHuesped(huesped.get());
        personaFisicaRepository.save(personaFisicaNueva);
        
        return personaFisicaNueva;
    }

    public PersonaJuridica buscarPersonaJuridicaPorId(Integer id) {
        return personaJuridicaRepository.findById(id)
                .orElseThrow(() -> new ResponsablePagoNoExistenteException("No se encontró un responsable de pago con id: " + id));
    }

    public PersonaJuridica modificarPersonaJuridica(Integer id, PersonaJuridicaDTO dto) {
        PersonaJuridica pj = personaJuridicaRepository.findById(id)
                .orElseThrow(() -> new ResponsablePagoNoExistenteException("No se encontró un responsable de pago con id: " + id));

        if (!pj.getCUIT().equals(dto.getCuit())) {
            if (!cuitUnico(dto.getCuit())) {
                throw new CuitYaExistenteException("El CUIT ingresado ya existe en el sistema.");
            }
        }

        pj.setRazonSocial(dto.getRazonSocial());
        pj.setCuit(dto.getCuit());
        pj.setTelefono(dto.getTelefono());
        if (dto.getDireccion() != null) {
            pj.setDireccion(dto.getDireccion().toEntity());
        }
        return personaJuridicaRepository.save(pj);
    }

    public ResponsablePago darAltaPersonaJuridica(PersonaJuridica personaJuridica) {
        if(!cuitUnico(personaJuridica.getCUIT())){
            throw new CuitYaExistenteException("El cuit ingresado ya existe en el sistema.");
        }
       return personaJuridicaRepository.save(personaJuridica);
    }

	public List<ResponsablePago> buscarResponsablePago(BusquedaResponsablePagoDTO busquedaResponsableDTO) {
        List<ResponsablePago> responsables = new ArrayList<>();
        responsables.addAll(personaJuridicaRepository.findByCuitYRazonSocial(busquedaResponsableDTO.getCuit(), busquedaResponsableDTO.getRazonSocial()));
        responsables.addAll(personaFisicaRepository.findByCuitYRazonSocial(busquedaResponsableDTO.getCuit(), busquedaResponsableDTO.getRazonSocial()));

        if(responsables.isEmpty()){
            throw new ResponsablePagoNoExistenteException("No se encontró un responsable pago para los atributos proporcionados.");
        }
        
        return responsables;
    }

    public void darBajaResponsable(Integer id) {
        Optional<ResponsablePago> responsableOptional = responsablePagoRepository.findById(id);

        if(responsableOptional.isEmpty()){
            throw new ResponsablePagoNoExistenteException("El id ingresado " + id + " no corresponde a ningún responsable de pago.");
        }

        ResponsablePago responsablePago = responsableOptional.get();
        
        if(responsablePago.tieneFacturas()){
            throw new FacturaAsociadaException("El responsable " + responsablePago.getRazonSocial() + " tiene factura/s asociada/s.");
        }
        
        responsablePagoRepository.delete(responsablePago);
    }

}