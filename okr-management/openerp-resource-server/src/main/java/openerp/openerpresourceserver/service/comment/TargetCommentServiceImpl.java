package openerp.openerpresourceserver.service.comment;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.TargetComment;
import openerp.openerpresourceserver.repo.TargetCommentRepo;
import openerp.openerpresourceserver.request.comment.UpdateCommentRequest;

@AllArgsConstructor
@Service
public class TargetCommentServiceImpl implements TargetCommentService {

    private final TargetCommentRepo commentRepo;

    @Override
    public List<TargetComment> findByDepartment(Long departmentId, int page, int size) {
        Pageable pagingSort = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "created_stamp"));
        Page<TargetComment> pageTuts = commentRepo.findByDepartment(departmentId, pagingSort);

        return pageTuts.getContent();

    }

    @Override
    public Optional<TargetComment> findById(Long id) {
        return commentRepo.findById(id);
    }

    @Override
    public TargetComment create(TargetComment comment) {
        return commentRepo.save(comment);
    }

    @Override
    public TargetComment update(Long id, UpdateCommentRequest data) {
        Optional<TargetComment> oldEntity = commentRepo.findById(id);

        if (oldEntity.isEmpty()) {
            throw new EntityNotFoundException("Comment not found with id: " + id);
        }
        TargetComment target = oldEntity.get();
        target.setMessage(data.getMessage());

        return commentRepo.save(target);
    }

    @Override
    public void deleteById(Long id) {
        List<TargetComment> childrenToDelete = commentRepo.findByPTargetComments(id);
        commentRepo.deleteAll(childrenToDelete);
        commentRepo.deleteById(id);

    }

    @Override
    public List<TargetComment> findByParentTargetComments(Long commentId, int page, int size) {
        Pageable pagingSort = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "created_stamp"));
        Page<TargetComment> pageTuts = commentRepo.findByParentTargetComments(commentId, pagingSort);
        return pageTuts.getContent();

    }

}
