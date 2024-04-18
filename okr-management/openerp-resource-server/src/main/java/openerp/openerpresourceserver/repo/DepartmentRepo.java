package openerp.openerpresourceserver.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import openerp.openerpresourceserver.entity.Department;

public interface DepartmentRepo extends JpaRepository<Department, Long> {
    @Query(value = "SELECT * FROM okr_department", nativeQuery = true)
    Page<Department> findAllDep(Pageable pagingSort);
}