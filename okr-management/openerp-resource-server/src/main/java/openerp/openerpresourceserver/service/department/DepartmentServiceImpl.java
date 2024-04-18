package openerp.openerpresourceserver.service.department;

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
import openerp.openerpresourceserver.entity.Department;
import openerp.openerpresourceserver.repo.DepartmentRepo;
import openerp.openerpresourceserver.request.target.CreateDeparment;

@AllArgsConstructor
@Service
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepo departmentRepo;

    @Override
    public Map<String, Object> findAll(int page, int size) {
        Pageable pagingSort = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "created_stamp"));
        Page<Department> pageTuts = departmentRepo.findAllDep(pagingSort);

        Map<String, Object> response = new HashMap<>();
        response.put("departments", pageTuts.getContent());
        response.put("currentPage", pageTuts.getNumber());
        response.put("totalItems", pageTuts.getTotalElements());
        response.put("totalPages", pageTuts.getTotalPages());

        return response;

    }

    @Override
    public Optional<Department> findById(Long id) {
        return departmentRepo.findById(id);
    }

    @Override
    public Department create(Department data) {
        return departmentRepo.save(data);
    }

    @Override
    public Department update(Long id, CreateDeparment data) {
        Optional<Department> oldEntity = departmentRepo.findById(id);

        if (oldEntity.isEmpty()) {
            throw new EntityNotFoundException("Department not found with id: " + id);
        }
        Department member = oldEntity.get();
        member.setName(data.getName());

        return departmentRepo.save(member);
    }

    @Override
    public void deleteById(Long id) {
        departmentRepo.deleteById(id);
    }
}
