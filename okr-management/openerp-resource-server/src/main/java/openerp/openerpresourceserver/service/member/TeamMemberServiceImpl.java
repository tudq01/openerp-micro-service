package openerp.openerpresourceserver.service.member;

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
import openerp.openerpresourceserver.entity.DepartmentRole;
import openerp.openerpresourceserver.entity.TeamMember;
import openerp.openerpresourceserver.repo.TeamMemberRepo;
import openerp.openerpresourceserver.request.member.UpdateDMember;

@AllArgsConstructor
@Service
public class TeamMemberServiceImpl implements TeamMemberService {

    private final TeamMemberRepo memberRepo;

    @Override
    public Map<String, Object> findByDepartment(Long teamId, int page, int size) {
        Pageable pagingSort = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "created_stamp"));
        Page<TeamMember> pageTuts = memberRepo.findByDepartment(teamId, pagingSort);

        Map<String, Object> response = new HashMap<>();
        response.put("members", pageTuts.getContent());
        response.put("currentPage", pageTuts.getNumber());
        response.put("totalItems", pageTuts.getTotalElements());
        response.put("totalPages", pageTuts.getTotalPages());

        return response;

    }

    @Override
    public Optional<TeamMember> findById(Long id) {
        return memberRepo.findById(id);
    }

    @Override
    public TeamMember create(TeamMember comment) {
        return memberRepo.save(comment);
    }

    @Override
    public TeamMember update(Long id, UpdateDMember data) {
        Optional<TeamMember> oldEntity = memberRepo.findById(id);

        if (oldEntity.isEmpty()) {
            throw new EntityNotFoundException("Comment not found with id: " + id);
        }
        TeamMember member = oldEntity.get();
        member.setRole(DepartmentRole.valueOf(data.getRole()));

        return memberRepo.save(member);
    }

    @Override
    public void deleteById(Long id) {
        memberRepo.deleteById(id);
    }

}
