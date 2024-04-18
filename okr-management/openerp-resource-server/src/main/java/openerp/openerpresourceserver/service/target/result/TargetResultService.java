package openerp.openerpresourceserver.service.target.result;

import java.util.List;

import openerp.openerpresourceserver.entity.TargetResult;

public interface TargetResultService {
    List<TargetResult> findAll(Long departmentId);

    public TargetResult updateById(Long id, TargetResult newEntity);

    public TargetResult create(TargetResult targetResult);
}
