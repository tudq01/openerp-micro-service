package openerp.openerpresourceserver.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import openerp.openerpresourceserver.entity.TargetCategory;

public interface TargetCategoryRepo extends JpaRepository<TargetCategory, Long> {
    // @Query(value = "SELECT * FROM okr_target t", nativeQuery = true)
    // List<TargetCategory> findAll();

    @Query(value = "SELECT * FROM okr_target_category t "
            + "WHERE (:keyword IS NULL OR LOWER(t.type) LIKE CONCAT('%', LOWER(:keyword), '%')) ", nativeQuery = true)
    Page<TargetCategory> findAll(@Param("keyword") String keyword, Pageable pageable);
}