package openerp.openerpresourceserver.service.target.period;

import java.util.Map;

import openerp.openerpresourceserver.entity.TargetPeriod;

public interface TargetPeriodService {
    Map<String, Object> findAll(String keyword, String fromDate,
            String toDate, int page,
            int size);

    public TargetPeriod updateById(Long id, TargetPeriod newEntity);

    public TargetPeriod create(TargetPeriod targetResult);
}
