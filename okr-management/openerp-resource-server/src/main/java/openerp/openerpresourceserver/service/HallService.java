package openerp.openerpresourceserver.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import openerp.openerpresourceserver.entity.building.Hall;

public interface HallService {
    List<Hall> findAll();
    Optional<Hall> findById(Long id);
    Hall save(Hall entity);
    Hall updateById(Long id,Hall newEntity);
    void deleteById(Long id);

    Map<String, Object> getAllHall(String name, int page, int size, String[] sort);
 }
