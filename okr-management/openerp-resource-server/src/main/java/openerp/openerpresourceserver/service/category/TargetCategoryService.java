package openerp.openerpresourceserver.service.category;

import java.util.Map;

import openerp.openerpresourceserver.entity.TargetCategory;

public interface TargetCategoryService {

    Map<String, Object> findAll(String keyword, int page,
            int size);

    void create(TargetCategory newEntity);

    TargetCategory updateById(Long id, TargetCategory newEntity);

    void deleteById(Long id);
}
