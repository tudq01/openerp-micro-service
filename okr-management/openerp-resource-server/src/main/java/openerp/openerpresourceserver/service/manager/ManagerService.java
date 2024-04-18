package openerp.openerpresourceserver.service.manager;

import java.util.Map;
import java.util.Optional;

import openerp.openerpresourceserver.entity.UserManger;
import openerp.openerpresourceserver.request.manager.UpdateMangerRequest;

public interface ManagerService {
    Optional<UserManger> findByUserIdOptional(String id);

    Optional<UserManger> findById(Long id);

    void deleteById(Long id);

    UserManger create(UserManger data);

    UserManger update(String userId, UpdateMangerRequest data);

    Map<String, Object> findManageEmployee(String managerId, int page, int size);
}
