package openerp.openerpresourceserver.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import openerp.openerpresourceserver.entity.TargetResult;

public interface TargetResultRepo extends JpaRepository<TargetResult, Long> {
    @Query(value = "SELECT * FROM okr_target_result t WHERE t.target_id = :target_id", nativeQuery = true)
    List<TargetResult> findByDepartment(@Param("target_id") Long departmentId);
}