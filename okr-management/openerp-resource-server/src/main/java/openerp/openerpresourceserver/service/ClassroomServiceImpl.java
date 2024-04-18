package openerp.openerpresourceserver.service;


import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.entity.building.ClassRoom;
import openerp.openerpresourceserver.entity.building.Hall;
import openerp.openerpresourceserver.repo.ClassroomRepo;
import openerp.openerpresourceserver.repo.HallRepo;
import openerp.openerpresourceserver.request.room.CreateClassroomRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.lang.reflect.ParameterizedType;
import java.util.*;

@Log4j2
@Service
public class ClassroomServiceImpl implements ClassroomService{
    private final ClassroomRepo baseRepository;
    private final HallRepo hallRepository;

    private Class getGenericClass() {
        return ((Class<ClassRoom>)
                ((ParameterizedType) getClass().getGenericSuperclass())
                        .getActualTypeArguments()[0]);
    }

    public ClassroomServiceImpl (ClassroomRepo roomRepository, HallRepo hallRepository) {
        this.baseRepository = roomRepository;
        this.hallRepository = hallRepository;
    }

    @Override
    public List<ClassRoom> findAll() {
        return baseRepository.findAll();
    }

    @Override
    public Optional<ClassRoom> findById(Long id) {
        return baseRepository.findById(id);

    }



    // not good!
    @Override

    public ClassRoom updateById(Long id, ClassRoom newEntity) {
        Optional<ClassRoom> oldEntity = this.findById(id);

        if(oldEntity.isEmpty()){
            throw new EntityNotFoundException("Classroom not found with id: " + id);
        }
        ClassRoom room = oldEntity.get();
        if(newEntity.getName()!= null){
            room.setName(newEntity.getName());
        }
        if(newEntity.getDescription()!= null){
            room.setDescription(newEntity.getDescription());
        }
        if(newEntity.getCapacity()!=null){
            room.setCapacity(newEntity.getCapacity());
        }
        if(newEntity.getFloor()!=null){
            room.setFloor(newEntity.getFloor());
        }
        if(newEntity.getType()!=null){
            room.setType(newEntity.getType());
        }


        return baseRepository.save(room);

    }

    @Override

    public void deleteById(Long id) {
        Optional<Optional<ClassRoom>> optional = Optional.ofNullable(this.findById(id));
        optional.map(entity -> {
                    baseRepository.deleteById(id);
                    return id;
                });

    }

    private Sort.Direction getSortDirection(String direction) {
        if (direction.equals("asc")) {
            return Sort.Direction.ASC;
        } else if (direction.equals("desc")) {
            return Sort.Direction.DESC;
        }

        return Sort.Direction.ASC;
    }

    @Override
    public Map<String, Object> getAllRoom(Long hallId,String name, int page, int size, String[] sort) {
        try {
            List<Sort.Order> orders = new ArrayList<Sort.Order>();

            if (sort[0].contains(",")) {
                // will sort more than 2 fields
                // sortOrder="field, direction"
                //sort  = name,asc
                //& sort = description,desc
                for (String sortOrder : sort) {
                    String[] _sort = sortOrder.split(",");
                    orders.add(new Sort.Order(getSortDirection(_sort[1]), _sort[0]));
                }
            } else {
                // sort=[field, direction]
                orders.add(new Sort.Order(getSortDirection(sort[1]), sort[0]));
            }

            List<ClassRoom> rooms = new ArrayList<ClassRoom>();
            Pageable pagingSort = PageRequest.of(page, size, Sort.by(orders));

            Page<ClassRoom> pageTuts;
            if (name == null)
                pageTuts = baseRepository.findByHall_Id(hallId,pagingSort);
            else
                pageTuts = baseRepository.findByHall_IdAndTitleContainingIgnoreCase(hallId,name,pagingSort); // paging sort to do fix this

            rooms = pageTuts.getContent();

            Map<String, Object> response = new HashMap<>();
            response.put("rooms", rooms);
            response.put("currentPage", pageTuts.getNumber());
            response.put("totalItems", pageTuts.getTotalElements());
            response.put("totalPages", pageTuts.getTotalPages());

            return response;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public ClassRoom save(CreateClassroomRequest input) {
        ClassRoom room = new ClassRoom();
        room.setName(input.getName());
        room.setCapacity((input.getCapacity()));
        room.setFloor(input.getFloor());
        room.setDescription(input.getDescription());
        room.setType(input.getType());
        Hall hall =  hallRepository.findById(input.getHallId()).orElse(null);
        room.setHall(hall);

        return baseRepository.save(room);
    }
}
