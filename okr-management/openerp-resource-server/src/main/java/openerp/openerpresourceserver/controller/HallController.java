package openerp.openerpresourceserver.controller;

import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.building.ClassRoom;
import openerp.openerpresourceserver.entity.building.Hall;
import openerp.openerpresourceserver.request.room.CreateClassroomRequest;
import openerp.openerpresourceserver.service.ClassroomService;
import openerp.openerpresourceserver.service.HallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
public class HallController {

    private HallService hallService;
    private ClassroomService roomService;

    @GetMapping("/halls")
    public ResponseEntity<Map<String, Object>> getFilterTodo(@RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        return ResponseEntity.ok().body(hallService.getAllHall(name, page, size, sort));

    }

    @GetMapping("/rooms")
    public ResponseEntity<Map<String, Object>> getFilterClass(@RequestParam(required = false) String name,
            @RequestParam(required = true) int hallId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        return ResponseEntity.ok().body(roomService.getAllRoom((long) hallId, name, page, size, sort));

    }

    @GetMapping("/halls/{id}")
    public ResponseEntity<?> one(@PathVariable String id) {

        Optional<Hall> hall = hallService.findById(Long.parseLong((id)));
        if (hall.isEmpty()) {
            String errorMessage = "Hall not found with ID: " + id;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        return ResponseEntity
                .ok()
                .body(hall);
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<?> findClass(@PathVariable String id) {

        Optional<ClassRoom> room = roomService.findById(Long.parseLong((id)));
        if (room.isEmpty()) {
            String errorMessage = "Room not found with ID: " + id;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        return ResponseEntity
                .ok()
                .body(room);
    }

    @PostMapping("/halls")
    public ResponseEntity<?> createHall(@RequestBody Hall request) {
        Hall hall = new Hall();
        hall.setName(request.getName());
        hall.setDescription(request.getDescription());
        hall.setLocation(
                request.getLocation());
        hall.setStatus(request.getStatus());
        hall.setTotalFloor(request.getTotalFloor());

        return ResponseEntity
                .ok()
                .body(hallService.save(hall));
    }

    @PostMapping("/halls/{id}/rooms")
    public ResponseEntity<?> createRoom(@RequestBody CreateClassroomRequest request, @PathVariable String id) {
        request.setHallId(Long.parseLong(id));

        return ResponseEntity
                .ok()
                .body(roomService.save(request));
    }

    @PatchMapping("/rooms/{id}")
    public ResponseEntity<?> update(@RequestBody ClassRoom request, @PathVariable String id) {
        return ResponseEntity
                .ok()
                .body(roomService.updateById(Long.parseLong((id)), request));
    }

    @PatchMapping("/halls/{id}")
    public ResponseEntity<?> update(@RequestBody Hall request, @PathVariable String id) {
        return ResponseEntity
                .ok()
                .body(hallService.updateById(Long.parseLong((id)), request));
    }

    @DeleteMapping("/halls/{id}")
    public ResponseEntity<?> remove(@PathVariable String id) {
        Optional<Hall> hall = hallService.findById(Long.parseLong((id)));
        if (hall.isEmpty()) {
            String errorMessage = "Hall not found with ID: " + id;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        hallService.deleteById(Long.parseLong((id)));
        return ResponseEntity
                .ok()
                .body("ok");
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<?> removeRoom(@PathVariable String id) {
        Optional<ClassRoom> room = roomService.findById(Long.parseLong((id)));
        if (room.isEmpty()) {
            String errorMessage = "Class room not found with ID: " + id;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
        roomService.deleteById(Long.parseLong((id)));
        return ResponseEntity
                .ok()
                .body("ok");
    }
}
