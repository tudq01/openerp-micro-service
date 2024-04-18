package openerp.openerpresourceserver.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import openerp.openerpresourceserver.entity.TeamMember;

public interface TeamMemberRepo extends JpaRepository<TeamMember, Long> {
    @Query(value = "SELECT * FROM okr_team_member t WHERE t.team_id = :team_id", nativeQuery = true)
    Page<TeamMember> findByDepartment(@Param("team_id") Long teamId,
            Pageable pagingSort);

    TeamMember findByUserId(String userId);
}