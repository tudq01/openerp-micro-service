package openerp.openerpresourceserver.service.target.period;

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
import openerp.openerpresourceserver.entity.TargetPeriod;
import openerp.openerpresourceserver.repo.TargetPeriodRepo;

@AllArgsConstructor
@Service
public class TargetPeriodServiceImpl implements TargetPeriodService {

    private final TargetPeriodRepo resultRepo;

    @Override
    public Map<String, Object> findAll(String keyword, String fromDate,
            String toDate,
            int page, int size) {
        Pageable pagingSort = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "created_stamp"));
        Page<TargetPeriod> pageTuts = resultRepo.findAll(keyword, fromDate, toDate, pagingSort);

        Map<String, Object> response = new HashMap<>();
        response.put("periods", pageTuts.getContent());
        response.put("currentPage", pageTuts.getNumber());
        response.put("totalItems", pageTuts.getTotalElements());
        response.put("totalPages", pageTuts.getTotalPages());

        return response;
    }

    public TargetPeriod create(TargetPeriod TargetPeriod) {
        return resultRepo.save(TargetPeriod);
    }

    public TargetPeriod update(TargetPeriod TargetPeriod) {
        return resultRepo.save(TargetPeriod);
    }

    public TargetPeriod updateById(Long id, TargetPeriod newEntity) {
        Optional<TargetPeriod> oldEntity = resultRepo.findById(id);

        if (oldEntity.isEmpty()) {
            throw new EntityNotFoundException("Target not found with id: " + id);
        }
        TargetPeriod target = oldEntity.get();
        if (newEntity.getTitle() != null) {
            target.setTitle(newEntity.getTitle());
        }
        if (newEntity.getFromDate() != null) {
            target.setFromDate(newEntity.getFromDate());
        }
        if (newEntity.getToDate() != null) {
            target.setToDate(newEntity.getToDate());
        }

        return resultRepo.save(target);

    }

}
