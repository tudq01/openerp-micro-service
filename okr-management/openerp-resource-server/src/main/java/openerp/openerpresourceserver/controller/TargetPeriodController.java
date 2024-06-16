package openerp.openerpresourceserver.controller;

import java.security.Principal;
import java.util.Map;
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
import openerp.openerpresourceserver.entity.TargetPeriod;
import openerp.openerpresourceserver.entity.UserManger;
import openerp.openerpresourceserver.repo.TargetPeriodRepo;
import openerp.openerpresourceserver.request.target.CreateTargetPeriod;
import openerp.openerpresourceserver.service.target.period.TargetPeriodService;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
public class TargetPeriodController {

    private TargetPeriodService TargetPeriodService;
    private TargetPeriodRepo TargetPeriodRepo;

    // Target
    @GetMapping("/targets/period")
    public ResponseEntity<Map<String, Object>> getTargetCategory(@RequestParam(required = false) String keyword,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        return ResponseEntity.ok().body(TargetPeriodService.findAll(keyword, fromDate, toDate, page,
                size));
    }

    @PostMapping("/targets/period")
    public ResponseEntity<String> createKeyResult(Principal principal,
            @RequestBody CreateTargetPeriod keyResultRequest) {

        String currentUser = principal.getName();

        TargetPeriod keyResult = new TargetPeriod();
        keyResult.setTitle(keyResultRequest.getTitle());
        keyResult.setFromDate(keyResultRequest.getFromDate());
        keyResult.setToDate(keyResultRequest.getToDate());

        TargetPeriodService.create(keyResult);

        return ResponseEntity
                .ok()
                .body("Save target period successfully.");

    }

    @PatchMapping("/targets/period/{id}")
    public ResponseEntity<?> updateKeyResult(Principal principal, @RequestBody TargetPeriod request,
            @PathVariable String id) {

        Optional<TargetPeriod> TargetPeriod = TargetPeriodRepo.findById(Long.parseLong(id));

        if (TargetPeriod.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Target period not found.");
        }

        return ResponseEntity
                .ok()
                .body(TargetPeriodService.updateById(Long.parseLong((id)), request));
    }

    @DeleteMapping("/targets/period/{id}")
    public ResponseEntity<?> remove(@PathVariable String id) {
       
       TargetPeriodRepo.deleteById(Long.parseLong((id)));
        return ResponseEntity
                .ok()
                .body("ok");
    }

    @GetMapping("/targets/period/{id}")
    public ResponseEntity<Optional<TargetPeriod>> getTargetDetail(@PathVariable String id) {

        return ResponseEntity.ok().body(TargetPeriodRepo.findById(Long.parseLong(id)));
    }

}
