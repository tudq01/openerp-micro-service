package openerp.openerpresourceserver.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import openerp.openerpresourceserver.entity.TargetPeriod;

public interface TargetPeriodRepo extends JpaRepository<TargetPeriod, Long> {
    @Query(value = "SELECT * FROM okr_target_period t "
            + "WHERE  (:keyword IS NULL OR LOWER(t.title) LIKE CONCAT('%', LOWER(:keyword), '%'))"
            + "AND (:fromDate IS NULL OR t.from_date BETWEEN CAST(:fromDate AS timestamp) AND CAST(:toDate AS timestamp) "
            + "AND (:toDate IS NULL OR t.to_date BETWEEN CAST(:fromDate AS timestamp) AND CAST(:toDate AS timestamp)))", nativeQuery = true)
    Page<TargetPeriod> findAll(@Param("keyword") String keyword,

            @Param("fromDate") String fromDate, @Param("toDate") String toDate, Pageable pageable);
}
