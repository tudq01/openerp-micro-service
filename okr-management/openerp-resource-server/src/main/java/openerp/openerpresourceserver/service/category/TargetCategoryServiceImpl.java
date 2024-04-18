package openerp.openerpresourceserver.service.category;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.TargetCategory;
import openerp.openerpresourceserver.repo.TargetCategoryRepo;

@AllArgsConstructor
@Service
public class TargetCategoryServiceImpl implements TargetCategoryService {
    private final TargetCategoryRepo categoryRepo;

    @Override
    public List<TargetCategory> findAll() {
        return categoryRepo.findAll();
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
