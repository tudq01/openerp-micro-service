package openerp.openerpresourceserver.repo;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import openerp.openerpresourceserver.entity.UserManger;

public interface ManagerRepo extends JpaRepository<UserManger, Long> {
  @Query(value = "SELECT * FROM okr_user_manager t WHERE t.user_id = :user_id", nativeQuery = true)
  Optional<UserManger> findByUser_Manager(@Param("user_id") String hallId);

  @Query(value = "SELECT * FROM okr_user_manager t WHERE t.manager_id = :managerId ", nativeQuery = true)
  Page<UserManger> findByManagerId(String managerId, Pageable pageable);
}