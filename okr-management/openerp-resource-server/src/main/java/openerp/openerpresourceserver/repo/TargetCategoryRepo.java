package openerp.openerpresourceserver.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import openerp.openerpresourceserver.entity.TargetCategory;

public interface TargetCategoryRepo extends JpaRepository<TargetCategory, Long> {
    // @Query(value = "SELECT * FROM okr_target t", nativeQuery = true)
    // List<TargetCategory> findAll();
}