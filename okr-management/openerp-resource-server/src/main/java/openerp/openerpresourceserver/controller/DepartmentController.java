package openerp.openerpresourceserver.controller;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.Department;
import openerp.openerpresourceserver.entity.DepartmentRole;
import openerp.openerpresourceserver.entity.Team;
import openerp.openerpresourceserver.entity.TeamMember;
import openerp.openerpresourceserver.repo.TeamMemberRepo;
import openerp.openerpresourceserver.request.member.CreateDMember;
import openerp.openerpresourceserver.request.member.CreateTeam;
import openerp.openerpresourceserver.request.member.UpdateDMember;
import openerp.openerpresourceserver.request.member.UpdateTeam;
import openerp.openerpresourceserver.request.target.CreateDeparment;
import openerp.openerpresourceserver.service.department.DepartmentService;
import openerp.openerpresourceserver.service.member.TeamMemberService;
import openerp.openerpresourceserver.service.team.TeamService;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
public class DepartmentController {

    private DepartmentService departmentService;
    private TeamMemberService departmentMemberService;
    private TeamService teamService;
    private TeamMemberRepo teamMemberRepo;

    // Target
    @GetMapping("/departments")
    public ResponseEntity<Map<String, Object>> findAll(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        return ResponseEntity.ok().body(departmentService.findAll(page, size));
    }

    @PostMapping("/departments")
    public ResponseEntity<Department> createDepartment(
            @RequestBody CreateDeparment request) {

        Department member = new Department();
        member.setName(request.getName());

        return ResponseEntity.ok().body(departmentService.create(member));
    }

    @PatchMapping("/departments/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable String id,
            @RequestBody CreateDeparment request) {
        return ResponseEntity.ok().body(departmentService.update(Long.parseLong(id), request));
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<?> removeDepartment(@PathVariable String id) {
        Optional<Department> member = departmentService.findById(Long.parseLong(id));
        if (member.isEmpty()) {
            String errorMessage = "Comment not found with ID: " + id;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        departmentService.deleteById(Long.parseLong((id)));
        return ResponseEntity
                .ok()
                .body("ok");
    }

    @GetMapping("/teams/{id}/member")
    public ResponseEntity<Map<String, Object>> getTeamMember(@PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        return ResponseEntity.ok().body(departmentMemberService.findByDepartment(Long.parseLong(id), page, size));
    }

    @GetMapping("/teams/members")
    public ResponseEntity<Map<String, Object>> getAllTeamMember(Principal principal,
            @RequestParam(defaultValue = "0") int teamId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String userId = principal.getName();

        TeamMember teamMember = teamMemberRepo.findByUserId(userId);
        Long team = teamMember.getTeamId();
        if (teamId != 0) {
            team = (long) teamId;
        }

        // handle no data

        return ResponseEntity.ok()
                .body(departmentMemberService.findByDepartment(team, page, size));
    }

    @GetMapping("/teams/me")
    public ResponseEntity<TeamMember> getMyTeam(Principal principal) {
        String userId = principal.getName();
        TeamMember teamMember = teamMemberRepo.findByUserId(userId);
        return ResponseEntity.ok().body(teamMember);
    }

    @PostMapping("/teams/{id}/member")
    public ResponseEntity<TeamMember> createUserManger(
            @RequestBody CreateDMember request, @PathVariable String id) {

        TeamMember member = new TeamMember();
        member.setRole(DepartmentRole.valueOf(request.getRole()));
        member.setUserId(request.getUserId());
        member.setTeamId(Long.parseLong(id));

        return ResponseEntity.ok().body(departmentMemberService.create(member));
    }

    @PatchMapping("/teams/members/{id}")
    public ResponseEntity<TeamMember> updateManager(@PathVariable String id,
            @RequestBody UpdateDMember request) {
        return ResponseEntity.ok().body(departmentMemberService.update(Long.parseLong(id), request));
    }

    @DeleteMapping("/teams/members/{id}")
    public ResponseEntity<?> remove(@PathVariable String id) {
        Optional<TeamMember> member = departmentMemberService.findById(Long.parseLong(id));
        if (member.isEmpty()) {
            String errorMessage = "Comment not found with ID: " + id;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        departmentMemberService.deleteById(Long.parseLong((id)));
        return ResponseEntity
                .ok()
                .body("ok");
    }

    @GetMapping("/departments/{id}/teams")
    public ResponseEntity<Map<String, Object>> getTeam(@PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        return ResponseEntity.ok().body(teamService.findByDepartment(Long.parseLong(id), page, size));
    }

    @PostMapping("/departments/{id}/teams")
    public ResponseEntity<Team> createTeam(
            @RequestBody CreateTeam request, @PathVariable String id) {

        Team member = new Team();
        member.setName(request.getName());
        member.setDepartmentId(Long.parseLong(id));

        return ResponseEntity.ok().body(teamService.create(member));
    }

    @PatchMapping("/teams/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable String id,
            @RequestBody UpdateTeam request) {
        return ResponseEntity.ok().body(teamService.update(Long.parseLong(id), request));
    }

    @DeleteMapping("/teams/{id}")
    public ResponseEntity<?> removeTeam(@PathVariable String id) {
        Optional<Team> member = teamService.findById(Long.parseLong(id));
        if (member.isEmpty()) {
            String errorMessage = "Comment not found with ID: " + id;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        teamService.deleteById(Long.parseLong((id)));
        return ResponseEntity
                .ok()
                .body("ok");
    }
}
