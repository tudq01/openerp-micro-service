package openerp.openerpresourceserver.service.target;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import openerp.openerpresourceserver.entity.Department;
import openerp.openerpresourceserver.entity.KeyResult;
import openerp.openerpresourceserver.entity.Target;
import openerp.openerpresourceserver.request.target.CreateDeparment;

public interface TargetService {
    Map<String, Object> findAll(Long periodId, String keyword, String userId, String type, String fromDate, String toDate, int page,
            int size);

    Map<String, Object> findTargetTeam(Long periodId, String keyword,String userId,String type, int teamId, String fromDate, String toDate, int page, int size);

    Optional<Target> findById(Long id);

    Target updateById(Long id, Target newEntity);

    void deleteById(Long id);

    void saveTargetWithKeyResults(Target target, List<KeyResult> keyResults);

}
