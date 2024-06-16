package openerp.openerpresourceserver.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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
import openerp.openerpresourceserver.entity.TeamMember;
import openerp.openerpresourceserver.entity.UserManger;
import openerp.openerpresourceserver.repo.KeyResultRepo;
import openerp.openerpresourceserver.repo.TargetRepo;
import openerp.openerpresourceserver.repo.TeamMemberRepo;
import openerp.openerpresourceserver.request.manager.CreateUserManagerRequest;
import openerp.openerpresourceserver.request.manager.UpdateMangerRequest;
import openerp.openerpresourceserver.request.target.CreateOkrRequest;
import openerp.openerpresourceserver.request.target.CreateTargetRequest;
import openerp.openerpresourceserver.request.target.cascade.CreateKRCascade;
import openerp.openerpresourceserver.request.target.cascade.CreateTargetCascade;
import openerp.openerpresourceserver.service.manager.ManagerService;
import openerp.openerpresourceserver.service.target.TargetService;
import openerp.openerpresourceserver.service.target.keyresult.KeyResultService;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
public class TargetController {

    private ManagerService managerService;
    private TargetService targetService;
    private KeyResultService keyResultService;
    private TargetRepo targetRepo;
    private KeyResultRepo keyResultRepo;
    private TeamMemberRepo teamMemberRepo;

    @GetMapping("/users/your-manager")
    public ResponseEntity<Optional<UserManger>> getManager(Principal principal,
            @RequestParam(required = false) String employeeId) {
        String userId = principal.getName();
        if (employeeId != null) {
            userId = employeeId;
        }

        return ResponseEntity.ok().body(managerService.findByUserIdOptional(userId));
    }

    Boolean checkPermission(String permission) {
        Boolean hasPermission = false;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (authority.getAuthority().equals(permission)) {
                hasPermission = true;
                break;
            }
        }
        return hasPermission;
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

    @GetMapping("/targets/report")
    public ResponseEntity<?> getTarget(
            @RequestParam(required = false, defaultValue = "0") long periodId

    ) {

        return ResponseEntity.ok().body(
                targetRepo.findReportTarget(periodId));
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

        List<TargetType> type = Arrays.asList(TargetType.DEPARTMENT, TargetType.COMPANY);
        if (type.contains(TargetType.valueOf(targetRequest.getType())) && checkPermission("ROLE_OKR_STAFF")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission");
        }

        TargetStatus status = TargetStatus.valueOf(targetRequest.getStatus());
        //
        if (targetRequest.getProgress() != 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Progress should be 0");
        }

        if (!status.equals(TargetStatus.NOT_STARTED)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Status should be NOT_STARTED");
        }

        Target target = new Target();
        target.setTitle(targetRequest.getTitle());
        target.setProgress(targetRequest.getProgress());
        target.setFromDate(targetRequest.getFromDate());
        target.setToDate(targetRequest.getToDate());
        target.setStatus(status);
        target.setUserId(userId);
        target.setPeriodId(targetRequest.getPeriodId());
        target.setParentId(targetRequest.getParentId());
        target.setTargetCategoryId(targetRequest.getTargetCategoryId());
        if (!TargetType.valueOf(targetRequest.getType()).equals(TargetType.COMPANY)) {
            TeamMember teamMember = teamMemberRepo.findByUserId(userId);
            Long team = teamMember.getTeamId();
            target.setTeamId(team);
        }

        target.setType(TargetType.valueOf(targetRequest.getType()));
        List<KeyResult> keyResults = null;
        if (targetRequest.getKeyResults() != null) {
            targetRequest.getKeyResults().stream()
                    .filter(keyResult -> keyResult.getProgress() != 0)
                    .findAny()
                    .ifPresent(keyResult -> {
                        throw new IllegalArgumentException("Key result has progress not equal to 0");
                    });

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
    public ResponseEntity<?> update(@RequestBody Target request, @PathVariable String id, Principal principal) {
        System.out.println(request);
        String userRequestId = principal.getName();

        Optional<Target> _target = targetService.findById(Long.parseLong(id));
        if (_target.isEmpty()) {
            String errorMessage = "target not found with ID: " + id;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        List<TargetType> type = Arrays.asList(TargetType.DEPARTMENT, TargetType.COMPANY);
        if (type.contains(request.getType()) && checkPermission("ROLE_OKR_STAFF")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission");
        }

        Target target = _target.get();

        TargetStatus status = request.getStatus();

        // check permission
        String userId = target.getUserId();
        Optional<UserManger> manager = managerService.findByUserIdOptional(userId);

        // type okr
        if (target.getType() == TargetType.PERSONAL) {
            if (!checkPermission("ROLE_ADMIN")) {
                if (manager.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You need to have manager first");
                }
                if (!userRequestId.equals(manager.get().getManagerId()) && !userRequestId.equals(userId)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission to edit");
                }
                // apporveAt != null thi dc update progress != 0
                if (target.getApprovedAt() == null) {
                    List<TargetStatus> statusList = Arrays.asList(TargetStatus.NOT_STARTED, TargetStatus.APPROVE,
                            TargetStatus.REJECT);

                    if (request.getProgress() != 0 || !statusList.contains(status)) {
                        return ResponseEntity
                                .badRequest()
                                .body("Your manager need to approve OKR first");
                    }

                }

                // only manager allow
                if (status.equals(TargetStatus.APPROVE)) {

                    if (!manager.get().getManagerId().equals(userRequestId)) {
                        System.out.println(manager.get().getManagerId() + userRequestId);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You are not manager of this user");
                    }

                    if (status.equals(TargetStatus.APPROVE)) {
                        request.setApprovedAt(new Date());

                    }
                } else if (status.equals(TargetStatus.REJECT)) {
                    request.setApprovedAt(null);
                } else
                    request.setApprovedAt(target.getApprovedAt());
            }
        }

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

        List<TargetType> type = Arrays.asList(TargetType.DEPARTMENT, TargetType.COMPANY);
        if (type.contains(target.get().getType()) && checkPermission("ROLE_OKR_STAFF")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission");
        }

        targetService.deleteById(Long.parseLong((id)));
        return ResponseEntity
                .ok()
                .body("ok");
    }

    @GetMapping("/targets/cascade/{id}")
    public ResponseEntity<?> getTargetCascade(@PathVariable String id) {
        System.out.println(targetRepo.findTargetByKeyResult(Long.parseLong(id)));
        return ResponseEntity
                .ok()
                .body(targetRepo.findTargetByKeyResult(Long.parseLong(id)));
    }

    @PostMapping("/targets/cascade")
    public ResponseEntity<?> createTargetCascade(Principal principal,
            @RequestBody CreateTargetCascade targetRequest) {

        Optional<KeyResult> keyResult = keyResultRepo.findById(targetRequest.getKeyResultId());
        if (keyResult.isEmpty()) {
            String errorMessage = "key result not found with ID: " + targetRequest.getKeyResultId();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        KeyResult kr = keyResult.get();
        if (!kr.getTarget().getUserId().equals(principal.getName())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission");
        }

        Target target = new Target();
        target.setTitle(kr.getTitle());
        target.setProgress(0);
        target.setFromDate(kr.getFromDate());
        target.setToDate(kr.getToDate());
        target.setStatus(TargetStatus.NOT_STARTED);
        target.setUserId(targetRequest.getUserId());
        target.setPeriodId(kr.getTarget().getPeriodId());
        target.setTeamId(kr.getTarget().getTeamId());
        target.setType(TargetType.PERSONAL);
        target.setKeyResultId(targetRequest.getKeyResultId());

        return ResponseEntity
                .ok()
                .body(targetRepo.save(target));

    }

    @PostMapping("/targets/key-result/{id}/objective")
    public ResponseEntity<?> createKRObjective(@PathVariable String id, Principal principal) {

        Optional<KeyResult> keyResult = keyResultRepo.findById(Long.parseLong(id));
        if (keyResult.isEmpty()) {
            String errorMessage = "key result not found with ID: " + id;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        KeyResult kr = keyResult.get();
        if (!kr.getTarget().getUserId().equals(principal.getName())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission");
        }

        Target target = new Target();
        target.setTitle(kr.getTitle());
        target.setProgress(0);
        target.setFromDate(kr.getFromDate());
        target.setToDate(kr.getToDate());
        target.setStatus(TargetStatus.NOT_STARTED);
        target.setUserId(principal.getName());
        target.setPeriodId(kr.getTarget().getPeriodId());
        target.setParentId(kr.getTargetId());
        target.setTeamId(kr.getTarget().getTeamId());
        target.setType(TargetType.PERSONAL);

        keyResultService.deleteById(Long.parseLong(id));
        return ResponseEntity
                .ok()
                .body(targetRepo.save(target));

    }

    @PostMapping("/targets/key-result/{id}/cascade-team")
    public ResponseEntity<?> createKRCascadeTeam(Principal principal, @PathVariable String id,
            @RequestBody CreateKRCascade targetRequest) {
        //
        if (checkPermission("ROLE_OKR_STAFF")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission");
        }

        Optional<KeyResult> keyResult = keyResultRepo.findById(Long.parseLong(id));
        if (keyResult.isEmpty()) {
            String errorMessage = "key result not found with ID: " + id;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        KeyResult kr = keyResult.get();
        if (!kr.getTarget().getUserId().equals(principal.getName())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission");
        }

        Target target = new Target();
        target.setTitle(kr.getTitle());
        target.setProgress(0);
        target.setFromDate(kr.getFromDate());
        target.setToDate(kr.getToDate());
        target.setStatus(TargetStatus.NOT_STARTED);
        target.setUserId(targetRequest.getUserId());
        target.setPeriodId(kr.getTarget().getPeriodId());
        target.setKeyResultId(Long.parseLong(id));
        target.setType(TargetType.DEPARTMENT);

        return ResponseEntity
                .ok()
                .body(targetRepo.save(target));
    }

    // remove the assign cascade
    @PatchMapping("/targets/cascade/{id}")
    public ResponseEntity<?> removeTargetCascade(@PathVariable String id, Principal principal) {
        Target newTarget = targetRepo.findTargetByKeyResult(Long.parseLong(id));
        if (newTarget == null) {
            String errorMessage = "Target not found";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        if (checkPermission("ROLE_OKR_STAFF")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission");
        }

        newTarget.setKeyResultId(null);

        return ResponseEntity
                .ok()
                .body(targetService.updateById(newTarget.getId(), newTarget));
    }

    @PostMapping("/targets/{id}/key-results")
    public ResponseEntity<String> createKeyResult(
            @PathVariable String id, @RequestBody CreateOkrRequest[] request) {
        Optional<Target> _target = targetService.findById(Long.parseLong(id));
        if (_target.isEmpty()) {
            String errorMessage = "target not found with ID: " + id;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        List<TargetType> type = Arrays.asList(TargetType.DEPARTMENT, TargetType.COMPANY);
        if (type.contains(_target.get().getType()) && checkPermission("ROLE_OKR_STAFF")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission");
        }

        List<KeyResult> keyResults = new ArrayList<>();

        // progress !=0 throw error
        for (CreateOkrRequest keyResultRequest : request) {
            KeyResult keyResult = new KeyResult();
            keyResult.setTitle(keyResultRequest.getTitle());
            keyResult.setProgress(keyResultRequest.getProgress());
            keyResult.setFromDate(keyResultRequest.getFromDate());
            keyResult.setToDate(keyResultRequest.getToDate());
            keyResult.setTargetId(Long.parseLong(id));
            keyResult.setWeighted(keyResultRequest.getWeighted());

            keyResults.add(keyResult);
        }

        keyResultService.saveAll(keyResults);

        Target target = targetService.findById(Long.parseLong(id)).get();
        float sum = 0.0f;
        for (KeyResult kr : target.getKeyResults()) {

            sum += kr.getWeighted() * kr.getProgress();

        }

        sum = sum / 100;

        // Round up if the decimal part is greater than 0.5
        int finalSum = (int) sum; // Get the integer part
        if (sum - finalSum >= 0.5f) {
            finalSum++;
        }
        target.setProgress(finalSum);

        targetService.updateById(target.getId(), target);

        return ResponseEntity
                .ok()
                .body("Save key results successfully.");

    }

    // chua approve k update progress
    @PatchMapping("/targets/key-result/{id}")
    public ResponseEntity<?> updateKeyResult(@RequestBody KeyResult request, @PathVariable String id,
            Principal principal) {
        String userRequestId = principal.getName();

        KeyResult keyResult = keyResultRepo.findById(Long.parseLong(id)).get();
        Target target = targetService.findById(keyResult.getTargetId()).get();

        List<TargetType> type = Arrays.asList(TargetType.DEPARTMENT, TargetType.COMPANY);
        if (type.contains(target.getType()) && checkPermission("ROLE_OKR_STAFF")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission");
        }

        // check permission

        if (target.getType() == TargetType.PERSONAL) {
            if (!checkPermission("ROLE_ADMIN")) {
                String userId = target.getUserId();
                Optional<UserManger> manager = managerService.findByUserIdOptional(userId);
                if (manager.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You need to have manager first");
                }
                if (!userRequestId.equals(manager.get().getManagerId()) && !userRequestId.equals(userId)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission to edit");
                }
            }
        }

        // update progress if approve
        if (!checkPermission("ROLE_ADMIN")) {
            if (target.getApprovedAt() == null && request.getProgress() != 0) {
                return ResponseEntity
                        .badRequest()
                        .body("Your manager need to approve OKR first");
            }
        }

        keyResultService.updateById(Long.parseLong((id)), request);

        // Target newTarget = targetService.findById(keyResult.getTargetId()).get();
        float sum = 0.0f;
        for (KeyResult kr : target.getKeyResults()) {
            if (kr.getId() == Long.parseLong((id))) {
                sum += kr.getWeighted() * request.getProgress();
            } else
                sum += kr.getWeighted() * kr.getProgress();

        }

        sum = sum / 100;

        // Round up if the decimal part is greater than 0.5
        int finalSum = (int) sum; // Get the integer part
        if (sum - finalSum >= 0.5f) {
            finalSum++;
        }
        target.setProgress(finalSum);

        targetService.updateById(target.getId(), target);

        return ResponseEntity
                .ok()
                .body("update success");
    }

    @DeleteMapping("/targets/key-result/{id}")
    public ResponseEntity<?> deleteKeyResult(@PathVariable String id) {
        KeyResult keyResult = keyResultRepo.findById(Long.parseLong(id)).get();
        Target target = targetService.findById(keyResult.getTargetId()).get();

        List<TargetType> type = Arrays.asList(TargetType.DEPARTMENT, TargetType.COMPANY);
        if (type.contains(target.getType()) && checkPermission("ROLE_OKR_STAFF")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission");
        }

        keyResultService.deleteById(Long.parseLong(id));
        return ResponseEntity
                .ok()
                .body("Delete success");
    }

    @GetMapping("/targets/key-result/{id}")
    public ResponseEntity<?> getKeyResult(@PathVariable String id) {

        return ResponseEntity
                .ok()
                .body(keyResultRepo.findById(Long.parseLong(id)));
    }

}
