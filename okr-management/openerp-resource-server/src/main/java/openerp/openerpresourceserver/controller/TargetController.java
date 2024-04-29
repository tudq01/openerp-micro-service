package openerp.openerpresourceserver.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
import openerp.openerpresourceserver.entity.KeyResult;
import openerp.openerpresourceserver.entity.Target;
import openerp.openerpresourceserver.entity.TargetStatus;
import openerp.openerpresourceserver.entity.TargetType;
import openerp.openerpresourceserver.entity.UserManger;
import openerp.openerpresourceserver.request.manager.CreateUserManagerRequest;
import openerp.openerpresourceserver.request.manager.UpdateMangerRequest;
import openerp.openerpresourceserver.request.target.CreateOkrRequest;
import openerp.openerpresourceserver.request.target.CreateTargetRequest;
import openerp.openerpresourceserver.service.manager.ManagerService;
import openerp.openerpresourceserver.service.target.TargetService;
import openerp.openerpresourceserver.service.target.keyresult.KeyResultService;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
public class TargetController {

    private ManagerService managerService;
    private TargetService targetService;
    private KeyResultService keyResultService;

    // todo: get list user manager

    // User Manager
    // @Secured({ "ROLE_OKR_MANAGER" })
    // tim ng quan ly ban
    @GetMapping("/users/your-manager")
    public ResponseEntity<Optional<UserManger>> getManager(Principal principal) {
        String userId = principal.getName();
        return ResponseEntity.ok().body(managerService.findByUserIdOptional(userId));
    }

    // dsach nvien ban dang quan ly
    @GetMapping("/users/manager")
    public ResponseEntity<Map<String, Object>> getEmployeeManage(Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        String userId = principal.getName();

        return ResponseEntity.ok().body(managerService.findManageEmployee(userId, page, size));
    }

    // manager quan ly nhung nguoi nao
    @GetMapping("/users/admin/manager")
    public ResponseEntity<Map<String, Object>> getAdminEmployeeManage(@RequestParam(required = false) String managerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {

        return ResponseEntity.ok().body(managerService.findManageEmployee(managerId, page, size));
    }

    @PostMapping("/users/manager")
    public ResponseEntity<UserManger> createUserManger(@RequestBody CreateUserManagerRequest request,
            Principal principal) {
        UserManger userManger = new UserManger();
        userManger.setUserId(request.getUserId());
        userManger.setManagerId(principal.getName());

        return ResponseEntity.ok().body(managerService.create(userManger));
    }

    @PatchMapping("/users/{id}/manager")
    public ResponseEntity<UserManger> updateManager(@PathVariable String id,
            @RequestBody UpdateMangerRequest request) {
        return ResponseEntity.ok().body(managerService.update(id, request));
    }

    @DeleteMapping("/users/manager/{id}")
    public ResponseEntity<?> remove(@PathVariable String id) {
        Optional<UserManger> manager = managerService.findById(Long.parseLong(id));
        if (manager.isEmpty()) {
            String errorMessage = "Hall not found with ID: " + id;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        managerService.deleteById(Long.parseLong((id)));
        return ResponseEntity
                .ok()
                .body("ok");
    }

    // Target

    @GetMapping("/targets")
    public ResponseEntity<Map<String, Object>> getTarget(Principal principal,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "0") long periodId,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {

        return ResponseEntity.ok().body(
                targetService.findAll(periodId, keyword, userId, type, fromDate, toDate, page, size));
    }

    @GetMapping("/targets/{id}")
    public ResponseEntity<Optional<Target>> getTargetDetail(@PathVariable String id) {

        return ResponseEntity.ok().body(targetService.findById(Long.parseLong(id)));
    }

    @GetMapping("/targets/me")
    public ResponseEntity<Map<String, Object>> getMyTarget(Principal principal,
            @RequestParam(required = false) long periodId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {

        String userId = principal.getName();

        return ResponseEntity.ok().body(
                targetService.findAll(periodId, keyword, userId, type, fromDate, toDate, page, size));
    }

    @GetMapping("/targets/team")
    public ResponseEntity<Map<String, Object>> getMyTargetTeam(
            @RequestParam(required = false) long periodId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) int teamId,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return ResponseEntity.ok()
                .body(targetService.findTargetTeam(
                        periodId, keyword, userId, type, teamId, fromDate, toDate, page, size));
    }

    @PostMapping("/targets")
    public ResponseEntity<String> createTarget(Principal principal, @RequestBody CreateTargetRequest targetRequest) {
        String userId = principal.getName();
        System.out.println(userId);

        TargetStatus status = TargetStatus.valueOf(targetRequest.getStatus());
        //

        Target target = new Target();
        target.setTitle(targetRequest.getTitle());
        target.setProgress(targetRequest.getProgress());
        target.setFromDate(targetRequest.getFromDate());
        target.setToDate(targetRequest.getToDate());
        target.setStatus(status);
        target.setUserId(userId);
        target.setPeriodId(targetRequest.getPeriodId());
        target.setTargetCategoryId(targetRequest.getTargetCategoryId());

        target.setType(TargetType.valueOf(targetRequest.getType()));
        List<KeyResult> keyResults = null;
        if (targetRequest.getKeyResults() != null) {
            keyResults = targetRequest.getKeyResults().stream()
                    .map(keyResult -> new KeyResult(keyResult))
                    .collect(Collectors.toList());
        }

        targetService.saveTargetWithKeyResults(target, keyResults);

        return ResponseEntity
                .ok()
                .body("Target with key results saved successfully.");

    }

    @PatchMapping("/targets/{id}")
    public ResponseEntity<?> update(@RequestBody Target request, @PathVariable String id) {
        return ResponseEntity
                .ok()
                .body(targetService.updateById(Long.parseLong((id)), request));
    }

    @DeleteMapping("/targets/{id}")
    public ResponseEntity<?> removeTarget(@PathVariable String id) {
        Optional<Target> target = targetService.findById(Long.parseLong(id));
        if (target.isEmpty()) {
            String errorMessage = "target not found with ID: " + id;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        targetService.deleteById(Long.parseLong((id)));
        return ResponseEntity
                .ok()
                .body("ok");
    }

    @PostMapping("/targets/{id}/key-results")
    public ResponseEntity<String> createKeyResult(
            @PathVariable String id, @RequestBody CreateOkrRequest[] request) {

        List<KeyResult> keyResults = new ArrayList<>();

        for (CreateOkrRequest keyResultRequest : request) {
            KeyResult keyResult = new KeyResult();
            keyResult.setTitle(keyResultRequest.getTitle());
            keyResult.setProgress(keyResultRequest.getProgress());
            keyResult.setFromDate(keyResultRequest.getFromDate());
            keyResult.setToDate(keyResultRequest.getToDate());
            keyResult.setTargetId(Long.parseLong(id));

            keyResults.add(keyResult);
        }

        keyResultService.saveAll(keyResults);

        return ResponseEntity
                .ok()
                .body("Save key results successfully.");

    }

    @PatchMapping("/targets/{id}/key-result")
    public ResponseEntity<?> updateKeyResult(@RequestBody KeyResult request, @PathVariable String id) {
        return ResponseEntity
                .ok()
                .body(keyResultService.updateById(Long.parseLong((id)), request));
    }

    @DeleteMapping("/targets/key-result/{id}")
    public ResponseEntity<?> deleteKeyResult(@PathVariable String id) {
        keyResultService.deleteById(Long.parseLong(id));
        return ResponseEntity
                .ok()
                .body("Delete success");
    }

}
