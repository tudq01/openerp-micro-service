package openerp.openerpresourceserver.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import openerp.openerpresourceserver.entity.Target;

public interface TargetRepo extends JpaRepository<Target, Long> {
        @Query(value = "SELECT * FROM okr_target t "
                        + "WHERE t.user_id = :userId "
                        + "AND (:type IS NULL OR t.type = :type) "
                        + "AND (:fromDate IS NULL OR t.from_date BETWEEN CAST(:fromDate AS timestamp) AND CAST(:toDate AS timestamp) "
                        + "AND (:toDate IS NULL OR t.to_date BETWEEN CAST(:fromDate AS timestamp) AND CAST(:toDate AS timestamp)))", nativeQuery = true)
        Page<Target> findAll(String userId,
                        @Param("type") String type,
                        @Param("fromDate") String fromDate, @Param("toDate") String toDate, Pageable pageable);

        @Query(value = "SELECT t.id, t.title, t.progress, t.from_date, t.to_date, t.user_id, t.target_category_id, t.status, t.type, t.created_stamp, t.last_updated_stamp,t.reviewer_id "
                        + "FROM okr_target t "
                        + "JOIN okr_team_member m ON t.user_id = m.user_id "
                        + "WHERE m.team_id = :teamId "
                        + "AND t.type = :type "
                        + "AND (:fromDate IS NULL OR t.from_date BETWEEN CAST(:fromDate AS timestamp) AND CAST(:toDate AS timestamp) "
                        + "AND (:toDate IS NULL OR t.to_date BETWEEN CAST(:fromDate AS timestamp) AND CAST(:toDate AS timestamp)))", nativeQuery = true)
        Page<Target> findTargetTeam(
                        @Param("type") String type,
                        @Param("teamId") int teamId, 
                        @Param("fromDate") String fromDate, @Param("toDate") String toDate, Pageable pageable); 

}