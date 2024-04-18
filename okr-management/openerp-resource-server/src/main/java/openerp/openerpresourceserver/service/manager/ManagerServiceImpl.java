package openerp.openerpresourceserver.service.manager;

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
import openerp.openerpresourceserver.entity.UserManger;
import openerp.openerpresourceserver.repo.ManagerRepo;
import openerp.openerpresourceserver.request.manager.UpdateMangerRequest;

@AllArgsConstructor
@Service
public class ManagerServiceImpl implements ManagerService {
    private final ManagerRepo managerRepo;

    @Override
    public Optional<UserManger> findByUserIdOptional(String id) {
        return managerRepo.findByUser_Manager(id);
    }

    @Override
    public void deleteById(Long id) {
        Optional<Optional<UserManger>> optional = Optional.ofNullable(this.findByUserIdOptional(Long.toString(id)));
        optional.map(entity -> {
            managerRepo.deleteById(id);
            return id;
        });

    }

    @Override
    public UserManger create(UserManger data) {
        return managerRepo.save(data);
    }

    @Override
    public UserManger update(String userId, UpdateMangerRequest data) {
        Optional<UserManger> oldEntity = managerRepo.findByUser_Manager(userId);

        if (oldEntity.isEmpty()) {
            throw new EntityNotFoundException("Manager not found with userId: " + userId);
        }
        UserManger manager = oldEntity.get();
        manager.setManagerId(data.getManagerId());

        return managerRepo.save(manager);
    }

    @Override
    public Optional<UserManger> findById(Long id) {
        return managerRepo.findById(id);
    }

    @Override
    public Map<String, Object> findManageEmployee(String managerId, int page, int size) {
        Pageable pagingSort = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "created_stamp"));
        Page<UserManger> pageTuts = managerRepo.findByManagerId(managerId, pagingSort);

        Map<String, Object> response = new HashMap<>();
        response.put("employees", pageTuts.getContent());
        response.put("currentPage", pageTuts.getNumber());
        response.put("totalItems", pageTuts.getTotalElements());
        response.put("totalPages", pageTuts.getTotalPages());

        return response;

    }

}
