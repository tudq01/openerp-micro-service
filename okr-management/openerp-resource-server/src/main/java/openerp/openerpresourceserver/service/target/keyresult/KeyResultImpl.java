package openerp.openerpresourceserver.service.target.keyresult;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.KeyResult;
import openerp.openerpresourceserver.repo.KeyResultRepo;

@AllArgsConstructor
@Service
public class KeyResultImpl implements KeyResultService {
    private final KeyResultRepo keyResultRepo;

    @Override
    public void saveKeyResults(KeyResult keyResults) {
        keyResultRepo.save(keyResults);
    }

    public KeyResult updateById(Long id, KeyResult newEntity) {
        Optional<KeyResult> oldEntity = keyResultRepo.findById(id);

        if (oldEntity.isEmpty()) {
            throw new EntityNotFoundException("Target not found with id: " + id);
        }
        KeyResult target = oldEntity.get();
        if (newEntity.getTitle() != null) {
            target.setTitle(newEntity.getTitle());
        }
        if (newEntity.getProgress() != null) {
            target.setProgress(newEntity.getProgress());
        }
        if (newEntity.getFromDate() != null) {
            target.setFromDate(newEntity.getFromDate());
        }
        if (newEntity.getToDate() != null) {
            target.setToDate(newEntity.getToDate());
        }
        if (newEntity.getWeighted() != null) {
            target.setWeighted(newEntity.getWeighted());
        }

        return keyResultRepo.save(target);

    }

    @Override
    public void saveAll(List<KeyResult> keyResults) {
        keyResultRepo.saveAll(keyResults);
    }

    @Override
    public void deleteById(Long id) {
        keyResultRepo.deleteById(id);
    }

}
