package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.entity.building.ClassRoom;
import openerp.openerpresourceserver.request.room.CreateClassroomRequest;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ClassroomService {
    List<ClassRoom> findAll();
    Optional<ClassRoom> findById(Long id);
    ClassRoom save(CreateClassroomRequest entity);
    ClassRoom updateById(Long id,ClassRoom newEntity);
    void deleteById(Long id);

    Map<String, Object> getAllRoom(Long hallId,String name, int page, int size, String[] sort);
}
