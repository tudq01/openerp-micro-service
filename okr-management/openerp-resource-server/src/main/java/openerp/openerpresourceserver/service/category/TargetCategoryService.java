package openerp.openerpresourceserver.service.category;

import java.util.List;

import openerp.openerpresourceserver.entity.TargetCategory;

public interface TargetCategoryService {
    List<TargetCategory> findAll();

    void create(TargetCategory newEntity);

    TargetCategory updateById(Long id, TargetCategory newEntity);

    void deleteById(Long id);
}
