package openerp.openerpresourceserver.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import openerp.openerpresourceserver.entity.building.Hall;

public interface HallRepo extends JpaRepository<Hall, Long> {
    Page<Hall> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
