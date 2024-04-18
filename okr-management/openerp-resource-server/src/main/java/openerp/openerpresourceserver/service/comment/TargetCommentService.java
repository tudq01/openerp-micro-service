package openerp.openerpresourceserver.service.comment;

import java.util.List;
import java.util.Optional;

import openerp.openerpresourceserver.entity.TargetComment;
import openerp.openerpresourceserver.request.comment.UpdateCommentRequest;

public interface TargetCommentService {
   List<TargetComment> findByDepartment(Long departmentId, int page, int size);

   List<TargetComment> findByParentTargetComments(Long commentId, int page, int size);

   Optional<TargetComment> findById(Long id);

   TargetComment create(TargetComment comment);

   TargetComment update(Long id, UpdateCommentRequest data);

   void deleteById(Long id);

}
