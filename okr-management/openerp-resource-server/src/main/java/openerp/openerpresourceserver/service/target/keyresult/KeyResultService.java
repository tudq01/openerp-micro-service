package openerp.openerpresourceserver.service.target.keyresult;

import java.util.List;

import openerp.openerpresourceserver.entity.KeyResult;

public interface KeyResultService {
    void saveKeyResults(KeyResult keyResults);

    void saveAll(List<KeyResult> keyResults);

    KeyResult updateById(Long id, KeyResult newEntity);

    void deleteById(Long id);
}
