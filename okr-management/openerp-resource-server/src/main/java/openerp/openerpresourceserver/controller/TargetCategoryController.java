package openerp.openerpresourceserver.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.TargetCategory;
import openerp.openerpresourceserver.service.category.TargetCategoryService;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
public class TargetCategoryController {

    private TargetCategoryService targetCategoryService;

    // Target
    @GetMapping("/targets/categories")
    public ResponseEntity<List<TargetCategory>> getTargetCategory() {
        return ResponseEntity.ok().body(targetCategoryService.findAll());
    }

    @PostMapping("/targets/categories")
    public ResponseEntity<String> createTarget(@RequestBody TargetCategory targetRequest) {

        targetCategoryService.create(targetRequest);

        return ResponseEntity
                .ok()
                .body("Target with key results saved successfully.");

    }

    @PatchMapping("/targets/categories/{id}")
    public ResponseEntity<?> update(@RequestBody TargetCategory request, @PathVariable String id) {
        return ResponseEntity
                .ok()
                .body(targetCategoryService.updateById(Long.parseLong((id)), request));
    }

    @DeleteMapping("/targets/categories/{id}")
    public ResponseEntity<?> removeTarget(@PathVariable String id) {

        targetCategoryService.deleteById(Long.parseLong((id)));

        return ResponseEntity
                .ok()
                .body("ok");
    }

}
