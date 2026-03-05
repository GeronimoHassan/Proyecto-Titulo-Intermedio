package tp_hotel.tp_hotel.repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tp_hotel.tp_hotel.model.PagoCheque;

@Repository
public interface PagoChequeRepository extends JpaRepository<PagoCheque, Integer> {

    @Query("SELECT p FROM PagoCheque p WHERE p.fechaCobro BETWEEN :desde AND :hasta ORDER BY p.fechaCobro")
    List<PagoCheque> findByFechaCobroBetween(@Param("desde") LocalDate desde, @Param("hasta") LocalDate hasta);
}
