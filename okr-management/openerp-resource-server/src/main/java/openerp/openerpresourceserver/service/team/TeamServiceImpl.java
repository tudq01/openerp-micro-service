package openerp.openerpresourceserver.service.team;

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
import openerp.openerpresourceserver.entity.Team;
import openerp.openerpresourceserver.repo.TeamRepo;
import openerp.openerpresourceserver.request.member.UpdateTeam;

@AllArgsConstructor
@Service
public class TeamServiceImpl implements TeamService {

    private final TeamRepo memberRepo;

    @Override
    public Map<String, Object> findByDepartment(Long teamId, int page, int size) {
        Pageable pagingSort = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "created_stamp"));
        Page<Team> pageTuts = memberRepo.findByDepartment(teamId, pagingSort);

        Map<String, Object> response = new HashMap<>();
        response.put("teams", pageTuts.getContent());
        response.put("currentPage", pageTuts.getNumber());
        response.put("totalItems", pageTuts.getTotalElements());
        response.put("totalPages", pageTuts.getTotalPages());

        return response;

    }

    @Override
    public Optional<Team> findById(Long id) {
        return memberRepo.findById(id);
    }

    @Override
    public Team create(Team comment) {
        return memberRepo.save(comment);
    }

    @Override
    public Team update(Long id, UpdateTeam data) {
        Optional<Team> oldEntity = memberRepo.findById(id);

        if (oldEntity.isEmpty()) {
            throw new EntityNotFoundException("Comment not found with id: " + id);
        }
        Team member = oldEntity.get();
        member.setName(data.getName());

        return memberRepo.save(member);
    }

    @Override
    public void deleteById(Long id) {
        memberRepo.deleteById(id);
    }

}
