package openerp.openerpresourceserver.service.target.result;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.TargetResult;
import openerp.openerpresourceserver.repo.TargetResultRepo;

@AllArgsConstructor
@Service
public class TargetResultServiceImpl implements TargetResultService {

    private final TargetResultRepo resultRepo;

    @Override
    public List<TargetResult> findAll(Long departmentId) {
        return resultRepo.findByDepartment(departmentId);
    }

    public TargetResult create(TargetResult targetResult) {
        return resultRepo.save(targetResult);
    }

    public TargetResult update(TargetResult targetResult) {
        return resultRepo.save(targetResult);
    }

    public TargetResult updateById(Long id, TargetResult newEntity) {
        Optional<TargetResult> oldEntity = resultRepo.findById(id);

        if (oldEntity.isEmpty()) {
            throw new EntityNotFoundException("Target not found with id: " + id);
        }
        TargetResult target = oldEntity.get();
        if (newEntity.getSelfComment() != null) {
            target.setSelfComment(newEntity.getSelfComment());
        }
        if (newEntity.getSelfRank() != null) {
            target.setSelfRank(newEntity.getSelfRank());
        }
        if (newEntity.getManagerComment() != null) {
            target.setManagerComment(newEntity.getManagerComment());
        }
        if (newEntity.getManagerRank() != null) {
            target.setManagerRank(newEntity.getManagerRank());
        }

        return resultRepo.save(target);

    }

}
