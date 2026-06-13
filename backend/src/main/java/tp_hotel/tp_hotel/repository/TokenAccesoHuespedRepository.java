package tp_hotel.tp_hotel.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tp_hotel.tp_hotel.model.TokenAccesoHuesped;

@Repository
public interface TokenAccesoHuespedRepository extends JpaRepository<TokenAccesoHuesped, Long> {

    Optional<TokenAccesoHuesped> findByTokenAndActivoTrue(String token);
}
