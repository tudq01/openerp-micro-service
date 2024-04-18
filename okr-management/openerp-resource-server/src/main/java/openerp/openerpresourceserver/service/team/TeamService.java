package openerp.openerpresourceserver.service.team;

import java.util.Map;
import java.util.Optional;

import openerp.openerpresourceserver.entity.Team;
import openerp.openerpresourceserver.request.member.UpdateTeam;

public interface TeamService {
  Map<String, Object> findByDepartment(Long departmentId, int page, int size);

  Optional<Team> findById(Long id);

  Team create(Team comment);

  Team update(Long id, UpdateTeam data);

  void deleteById(Long id);
}