package openerp.openerpresourceserver.controller;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.Target;
import openerp.openerpresourceserver.entity.TargetResult;
import openerp.openerpresourceserver.entity.UserManger;
import openerp.openerpresourceserver.repo.TargetResultRepo;
import openerp.openerpresourceserver.request.target.CreateTargetResult;
import openerp.openerpresourceserver.service.manager.ManagerService;
import openerp.openerpresourceserver.service.target.TargetService;
import openerp.openerpresourceserver.service.target.result.TargetResultService;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
public class TargetResultController {

    private TargetResultService targetResultService;
    private TargetService targetService;
    private ManagerService managerService;
    private TargetResultRepo targetResultRepo;

    // Target
    @GetMapping("/targets/{id}/result")
    public ResponseEntity<List<TargetResult>> getTargetCategory(@PathVariable String id) {
        return ResponseEntity.ok().body(targetResultService.findAll(Long.parseLong(id)));
    }

    @PostMapping("/targets/{id}/result")
    public ResponseEntity<String> createKeyResult(Principal principal,
            @PathVariable String id, @RequestBody CreateTargetResult keyResultRequest) {

        String currentUser = principal.getName();

        Optional<Target> target = targetService.findById(Long.parseLong(id));
        if (target.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Target not found.");
        }
        String userId = target.get().getUserId();

        Optional<UserManger> manager = managerService.findByUserIdOptional(userId);
        if (manager.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("You do not have a manager.");
        }
        if (keyResultRequest.getSelfComment() != null || keyResultRequest.getSelfRank() != null) {
            if (!currentUser.equals(target.get().getUserId())) {
                return ResponseEntity
                        .badRequest()
                        .body("You are not the owner of this target.");
            }
        }

        if (keyResultRequest.getManagerComment() != null || keyResultRequest.getManagerRank() != null) {
            if (!currentUser.equals(manager.get().getManagerId())) {
                return ResponseEntity
                        .badRequest()
                        .body("You are not the manager of this user.");
            }
        }

        TargetResult keyResult = new TargetResult();
        keyResult.setSelfComment(keyResultRequest.getSelfComment());
        keyResult.setSelfRank(keyResultRequest.getSelfRank());
        keyResult.setManagerComment(keyResultRequest.getManagerComment());
        keyResult.setManagerRank(keyResultRequest.getManagerRank());

        keyResult.setTargetId(Long.parseLong(id));

        targetResultService.create(keyResult);

        return ResponseEntity
                .ok()
                .body("Save target results successfully.");

    }

    @PatchMapping("/targets/{id}/result")
    public ResponseEntity<?> updateKeyResult(Principal principal, @RequestBody TargetResult request,
            @PathVariable String id) {
        String currentUser = principal.getName();

        Optional<TargetResult> targetResult = targetResultRepo.findById(Long.parseLong(id));

        Optional<Target> target = targetService.findById(targetResult.get().getTargetId());
        if (target.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Target not found.");
        }
        String userId = target.get().getUserId();

        Optional<UserManger> manager = managerService.findByUserIdOptional(userId);
        if (manager.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("You do not have a manager.");
        }

        if (request.getSelfComment() != null || request.getSelfRank() != null) {
            if (!currentUser.equals(target.get().getUserId())) {
                return ResponseEntity
                        .badRequest()
                        .body("You are not the owner of this target.");
            }
        }

        if (request.getManagerComment() != null || request.getManagerRank() != null) {

            if (!currentUser.equals(manager.get().getManagerId())) {
                return ResponseEntity
                        .badRequest()
                        .body("You are not the manager of this user.");
            }
        }
        return ResponseEntity
                .ok()
                .body(targetResultService.updateById(Long.parseLong((id)), request));
    }

}
