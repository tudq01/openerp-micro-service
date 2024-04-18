package openerp.openerpresourceserver.controller;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.TargetComment;
import openerp.openerpresourceserver.request.comment.CreateCommentRequest;
import openerp.openerpresourceserver.request.comment.UpdateCommentRequest;
import openerp.openerpresourceserver.service.comment.TargetCommentService;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
public class TargetCommentController {

    private TargetCommentService targetCommentService;

    // delete parent also delete all child related

    // Target
    @GetMapping("/targets/{id}/comments")
    public ResponseEntity<List<TargetComment>> getTargetComments(@PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        return ResponseEntity.ok().body(targetCommentService.findByDepartment(Long.parseLong(id), page, size));
    }

    @GetMapping("/targets/comments/{id}")
    public ResponseEntity<List<TargetComment>> getChildComments(@PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        return ResponseEntity.ok()
                .body(targetCommentService.findByParentTargetComments(Long.parseLong(id), page, size));
    }

    @PostMapping("/targets/{id}/comments")
    public ResponseEntity<TargetComment> createUserManger(Principal principal,
            @RequestBody CreateCommentRequest request, @PathVariable String id) {
        String userId = principal.getName();

        TargetComment comment = new TargetComment();
        comment.setMessage(request.getMessage());
        comment.setParentId(request.getParentId() == null ? null : request.getParentId());
        comment.setTargetId(Long.parseLong(id));
        comment.setUserId(userId);

        return ResponseEntity.ok().body(targetCommentService.create(comment));
    }

    @PatchMapping("/targets/comments/{id}")
    public ResponseEntity<TargetComment> updateManager(@PathVariable String id,
            @RequestBody UpdateCommentRequest request) {
        return ResponseEntity.ok().body(targetCommentService.update(Long.parseLong(id), request));
    }

    @DeleteMapping("/targets/comments/{id}")
    public ResponseEntity<?> remove(@PathVariable String id) {
        Optional<TargetComment> manager = targetCommentService.findById(Long.parseLong(id));
        if (manager.isEmpty()) {
            String errorMessage = "Comment not found with ID: " + id;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        targetCommentService.deleteById(Long.parseLong((id)));
        return ResponseEntity
                .ok()
                .body("ok");
    }

}
