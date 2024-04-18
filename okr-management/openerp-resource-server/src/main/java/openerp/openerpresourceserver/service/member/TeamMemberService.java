package openerp.openerpresourceserver.service.member;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import openerp.openerpresourceserver.entity.TeamMember;
import openerp.openerpresourceserver.request.member.UpdateDMember;

public interface TeamMemberService {
  Map<String, Object> findByDepartment(Long departmentId, int page, int size);

  Optional<TeamMember> findById(Long id);

  TeamMember create(TeamMember comment);

  TeamMember update(Long id, UpdateDMember data);

  void deleteById(Long id);
}