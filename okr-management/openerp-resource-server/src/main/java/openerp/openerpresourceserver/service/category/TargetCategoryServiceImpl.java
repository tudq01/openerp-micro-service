package openerp.openerpresourceserver.service.category;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.Target;
import openerp.openerpresourceserver.entity.TargetCategory;
import openerp.openerpresourceserver.repo.TargetCategoryRepo;

@AllArgsConstructor
@Service
public class TargetCategoryServiceImpl implements TargetCategoryService {
    private final TargetCategoryRepo categoryRepo;

    @Override
    public Map<String, Object> findAll(String keyword,
            int page, int size) {
        Pageable pagingSort = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "created_stamp"));
        Page<TargetCategory> pageTuts = categoryRepo.findAll(keyword, pagingSort);

        Map<String, Object> response = new HashMap<>();
        response.put("categories", pageTuts.getContent());
        response.put("currentPage", pageTuts.getNumber());
        response.put("totalItems", pageTuts.getTotalElements());
        response.put("totalPages", pageTuts.getTotalPages());

        return response;
    }

    public void create(TargetCategory newEntity) {
        categoryRepo.save(newEntity);
    }

    public TargetCategory updateById(Long id, TargetCategory newEntity) {
        Optional<TargetCategory> oldEntity = categoryRepo.findById(id);

        if (oldEntity.isEmpty()) {
            throw new EntityNotFoundException("Category not found with id: " + id);
        }

        TargetCategory target = oldEntity.get();
        target.setType(newEntity.getType());

        return categoryRepo.save(target);

    }

    public void deleteById(Long id) {
        Optional<TargetCategory> oldEntity = categoryRepo.findById(id);

        if (oldEntity.isEmpty()) {
            throw new EntityNotFoundException("Category not found with id: " + id);
        }
        categoryRepo.deleteById(id);
    }

    public Optional<TargetCategory> findById(Long id) {
        return categoryRepo.findById(id);
    }

}
