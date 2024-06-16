package openerp.openerpresourceserver.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import openerp.openerpresourceserver.entity.Target;

public interface TargetRepo extends JpaRepository<Target, Long> {
        @Query(value = "SELECT * FROM okr_target t "
                        + "WHERE t.period_id = :periodId "
                        + "AND (:userId IS NULL OR t.user_id = :userId) "
                        + "AND (:keyword IS NULL OR LOWER(t.title) LIKE CONCAT('%', LOWER(:keyword), '%'))"
                        + "AND (:type IS NULL OR t.type = :type) "
                        + "AND (:fromDate IS NULL OR t.from_date BETWEEN CAST(:fromDate AS timestamp) AND CAST(:toDate AS timestamp) "
                        + "AND (:toDate IS NULL OR t.to_date BETWEEN CAST(:fromDate AS timestamp) AND CAST(:toDate AS timestamp)))", nativeQuery = true)
        Page<Target> findAll(Long periodId, @Param("keyword") String keyword, String userId,
                        @Param("type") String type,
                        @Param("fromDate") String fromDate, @Param("toDate") String toDate, Pageable pageable);

        @Query(value = "SELECT t.id, t.title, t.progress, t.from_date, t.to_date, t.user_id, t.target_category_id, t.status, t.type, t.created_stamp, t.last_updated_stamp,t.key_result_id,t.period_id, t.parent_id,t.approved_at, t.team_id "
                        + "FROM okr_target t "
                        + "WHERE t.period_id = :periodId "
                        + "AND (:teamId IS NULL OR t.team_id = :teamId) "
                        + "AND (:userId IS NULL OR t.user_id = :userId) "
                        + "AND t.type = :type "
                        + "AND (:keyword IS NULL OR LOWER(t.title) LIKE CONCAT('%', LOWER(:keyword), '%'))"
                        + "AND (:fromDate IS NULL OR t.from_date BETWEEN CAST(:fromDate AS timestamp) AND CAST(:toDate AS timestamp) "
                        + "AND (:toDate IS NULL OR t.to_date BETWEEN CAST(:fromDate AS timestamp) AND CAST(:toDate AS timestamp)))", nativeQuery = true)
        Page<Target> findTargetTeam(
                        Long periodId,
                        @Param("keyword") String keyword,
                        String userId,
                        @Param("type") String type,
                        @Param("teamId") int teamId,
                        @Param("fromDate") String fromDate, @Param("toDate") String toDate, Pageable pageable);

        @Query(value = "SELECT t.id, t.title, t.progress, t.from_date, t.to_date, t.user_id, t.target_category_id, t.status, t.type, t.created_stamp, t.last_updated_stamp,t.key_result_id,t.period_id, t.parent_id,t.approved_at, t.team_id "
                        + "FROM okr_target t "

                        + "WHERE t.key_result_id = :keyResultId ", nativeQuery = true)
        Target findTargetByKeyResult(
                        Long keyResultId);

        @Query(value = "SELECT * FROM okr_target t "
                        + "WHERE t.period_id = :periodId ", nativeQuery = true)
        List<Target> findReportTarget(Long periodId);

}