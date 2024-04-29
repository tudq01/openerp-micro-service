package openerp.openerpresourceserver.service.target;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.KeyResult;
import openerp.openerpresourceserver.entity.Target;
import openerp.openerpresourceserver.repo.TargetRepo;

@AllArgsConstructor
@Service
public class TargetServiceImpl implements TargetService {
    private final TargetRepo targetRepo;

    @Override
    public Map<String, Object> findAll(Long periodId, String keyword, String userId, String type, String fromDate,
            String toDate,
            int page, int size) {
        Pageable pagingSort = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "created_stamp"));
        Page<Target> pageTuts = targetRepo.findAll(periodId, keyword, userId, type, fromDate, toDate, pagingSort);

        Map<String, Object> response = new HashMap<>();
        response.put("targets", pageTuts.getContent());
        response.put("currentPage", pageTuts.getNumber());
        response.put("totalItems", pageTuts.getTotalElements());
        response.put("totalPages", pageTuts.getTotalPages());

        return response;
    }

    @Transactional
    public void saveTargetWithKeyResults(Target target, List<KeyResult> keyResults) {
        // Associate key results with the target
        Target newTarget = targetRepo.save(target);

        if (keyResults != null) {
            for (KeyResult keyResult : keyResults) {
                keyResult.setTargetId(newTarget.getId());
            }
            newTarget.setKeyResults(keyResults);

            // Save the target (and cascaded key results)
            targetRepo.save(newTarget);
        }
    }

    public Target updateById(Long id, Target newEntity) {
        Optional<Target> oldEntity = targetRepo.findById(id);

        if (oldEntity.isEmpty()) {
            throw new EntityNotFoundException("Target not found with id: " + id);
        }
        Target target = oldEntity.get();
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
        if (newEntity.getType() != null) {
            target.setType(newEntity.getType());
        }
        if (newEntity.getStatus() != null) {
            target.setStatus(newEntity.getStatus());
        }
        if (newEntity.getTargetCategoryId() != null) {
            target.setTargetCategoryId(newEntity.getTargetCategoryId());
        }
        if (newEntity.getPeriodId() != null) {
            target.setPeriodId(newEntity.getPeriodId());
        }

        return targetRepo.save(target);

    }

    public void deleteById(Long id) {
        targetRepo.deleteById(id);
    }

    public Optional<Target> findById(Long id) {
        return targetRepo.findById(id);
    }

    @Override
    public Map<String, Object> findTargetTeam(Long periodId,
            String keyword, String userId, String type, int teamId, String fromDate, String toDate, int page,
            int size) {
        Pageable pagingSort = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "created_stamp"));
        Page<Target> pageTuts = targetRepo.findTargetTeam(periodId, keyword, userId, type, teamId, fromDate, toDate,
                pagingSort);

        Map<String, Object> response = new HashMap<>();
        response.put("targets", pageTuts.getContent());
        response.put("currentPage", pageTuts.getNumber());
        response.put("totalItems", pageTuts.getTotalElements());
        response.put("totalPages", pageTuts.getTotalPages());

        return response;
    }
}
