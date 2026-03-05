package tp_hotel.tp_hotel.repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tp_hotel.tp_hotel.model.Pago;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Integer> {

    @Query("SELECT p FROM Pago p WHERE p.fecha BETWEEN :desde AND :hasta ORDER BY p.fecha")
    List<Pago> findByFechaBetween(@Param("desde") LocalDate desde, @Param("hasta") LocalDate hasta);
}