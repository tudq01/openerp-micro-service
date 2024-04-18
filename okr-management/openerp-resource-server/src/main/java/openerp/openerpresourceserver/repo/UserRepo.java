package openerp.openerpresourceserver.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import openerp.openerpresourceserver.entity.Team;
import openerp.openerpresourceserver.entity.User;

public interface UserRepo extends JpaRepository<User, String> {
    @Query(value = "SELECT * FROM okr_team t WHERE t.department_id = :department_id", nativeQuery = true)
    Page<Team> findEmployeeInTeam(@Param("department_id") Long departmentId,
            Pageable pagingSort);
}
