package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.building.ClassRoom;
import openerp.openerpresourceserver.entity.building.Hall;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClassroomRepo extends JpaRepository<ClassRoom, Long> {
    Page<ClassRoom> findByHall_Id(Long hallId,Pageable pageable);

    @Query(value = "SELECT * FROM classroom t WHERE t.hall_id = :hall_id" +
            " AND (:name IS NULL OR LOWER(t.name) LIKE %:name%)", nativeQuery = true)
    Page<ClassRoom> findByHall_IdAndTitleContainingIgnoreCase(@Param("hall_id") Long hallId, @Param("name")String title,Pageable pageable);
}
