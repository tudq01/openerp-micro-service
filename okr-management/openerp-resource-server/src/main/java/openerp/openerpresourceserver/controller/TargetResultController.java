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
import openerp.openerpresourceserver.entity.TargetResult;
import openerp.openerpresourceserver.entity.UserManger;
import openerp.openerpresourceserver.request.target.CreateTargetResult;
import openerp.openerpresourceserver.service.manager.ManagerService;
import openerp.openerpresourceserver.service.target.result.TargetResultService;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
public class TargetResultController {

    private TargetResultService targetResultService;
    private ManagerService managerService;

    // Target
    @GetMapping("/targets/{id}/result")
    public ResponseEntity<List<TargetResult>> getTargetCategory(@PathVariable String id) {
        return ResponseEntity.ok().body(targetResultService.findAll(Long.parseLong(id)));
    }

    @PostMapping("/targets/{id}/result")
    public ResponseEntity<String> createKeyResult(Principal principal,
            @PathVariable String id, @RequestBody CreateTargetResult keyResultRequest) {

        String userId = principal.getName();
        Optional<UserManger> manager = managerService.findByUserIdOptional(userId);
        if (manager.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("You do not have a manager.");
        }
        if (keyResultRequest.getManagerComment() != null || keyResultRequest.getManagerRank() != null) {
            if (userId != manager.get().getManagerId()) {
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
        String userId = principal.getName();
        Optional<UserManger> manager = managerService.findByUserIdOptional(userId);
        if (manager.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("You do not have a manager.");
        }
        if (request.getManagerComment() != null || request.getManagerRank() != null) {
            if (userId != manager.get().getManagerId()) {
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
