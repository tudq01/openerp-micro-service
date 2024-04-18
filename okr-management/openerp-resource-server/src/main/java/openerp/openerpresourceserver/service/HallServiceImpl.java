package openerp.openerpresourceserver.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.entity.building.Hall;
import openerp.openerpresourceserver.repo.HallRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import java.lang.reflect.ParameterizedType;
import java.rmi.UnexpectedException;
import java.util.*;

@Log4j2
@Service
public class HallServiceImpl implements HallService{
    private final HallRepo baseRepository;

    private Class getGenericClass() {
        return ((Class<Hall>)
                ((ParameterizedType) getClass().getGenericSuperclass())
                        .getActualTypeArguments()[0]);
    }

    public HallServiceImpl(HallRepo hallRepository) {
        this.baseRepository = hallRepository;
    }

    @Override
    public List<Hall> findAll() {
        return baseRepository.findAll();
    }

    @Override
    public Optional<Hall> findById(Long id) {
        return baseRepository.findById(id);

    }

    @Override

    public Hall save(Hall entity) {
        return baseRepository.save(entity);
    }

    // not good!
    @Override

    public Hall updateById(Long id, Hall newEntity) {
        Optional<Hall> oldEntity = this.findById(id);
        if(oldEntity.isEmpty()){
           throw new EntityNotFoundException("Hall not found with id: " + id);
        }
        Hall hall = oldEntity.get();
        if(newEntity.getName()!= null){
            hall.setName(newEntity.getName());
        }
        if(newEntity.getDescription()!= null){
          hall.setDescription(newEntity.getDescription());
        }
        if(newEntity.getStatus()!=null){
            hall.setStatus(newEntity.getStatus());
        }
        if(newEntity.getTotalFloor()!=null){
            hall.setTotalFloor(newEntity.getTotalFloor());
        }
        if(newEntity.getLocation()!=null){
            hall.setLocation(newEntity.getLocation());
        }


        return baseRepository.save(hall);
    }

    @Override

    public void deleteById(Long id) {
        Optional<Optional<Hall>> optional = Optional.ofNullable(this.findById(id));
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
    public Map<String, Object> getAllHall(String name, int page, int size, String[] sort) {
        try {
            List<Sort.Order> orders = new ArrayList<Sort.Order>();

            if (sort[0].contains(",")) {
                // will sort more than 2 fields
                // sortOrder="field, direction"
                for (String sortOrder : sort) {
                    String[] _sort = sortOrder.split(",");
                    orders.add(new Sort.Order(getSortDirection(_sort[1]), _sort[0]));
                }
            } else {
                // sort=[field, direction]
                orders.add(new Sort.Order(getSortDirection(sort[1]), sort[0]));
            }

            List<Hall> halls = new ArrayList<Hall>();
            Pageable pagingSort = PageRequest.of(page, size, Sort.by(orders));

            Page<Hall> pageTuts;
            if (name == null)
                pageTuts = baseRepository.findAll(pagingSort);
            else
                pageTuts = baseRepository.findByNameContainingIgnoreCase(name, pagingSort);

            halls = pageTuts.getContent();

            Map<String, Object> response = new HashMap<>();
            response.put("halls", halls);
            response.put("currentPage", pageTuts.getNumber());
            response.put("totalItems", pageTuts.getTotalElements());
            response.put("totalPages", pageTuts.getTotalPages());

            return response;
        } catch (Exception e) {
           return null;
        }
    }

}
