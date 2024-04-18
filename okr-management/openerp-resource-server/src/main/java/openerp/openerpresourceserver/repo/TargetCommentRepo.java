package openerp.openerpresourceserver.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import openerp.openerpresourceserver.entity.TargetComment;

public interface TargetCommentRepo extends JpaRepository<TargetComment, Long> {
    @Query(value = "SELECT * FROM okr_target_comments t WHERE t.target_id = :target_id AND t.parent_id IS NULL", nativeQuery = true)
    Page<TargetComment> findByDepartment(@Param("target_id") Long departmentId, Pageable pageable);

    @Query(value = "SELECT * FROM okr_target_comments t WHERE t.parent_id = :comment_id", nativeQuery = true)
    Page<TargetComment> findByParentTargetComments(@Param("comment_id") Long commentId, Pageable pageable);

    @Query(value = "SELECT * FROM okr_target_comments t WHERE t.parent_id = :comment_id", nativeQuery = true)
    List<TargetComment> findByPTargetComments(@Param("comment_id") Long commentId);
}