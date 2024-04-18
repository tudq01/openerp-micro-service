package openerp.openerpresourceserver.service.department;

import java.util.Map;
import java.util.Optional;

import openerp.openerpresourceserver.entity.Department;
import openerp.openerpresourceserver.request.target.CreateDeparment;

public interface DepartmentService {
  Map<String, Object> findAll(int page, int size);

  Optional<Department> findById(Long id);

  Department create(Department comment);

  Department update(Long id, CreateDeparment data);

  void deleteById(Long id);

}
