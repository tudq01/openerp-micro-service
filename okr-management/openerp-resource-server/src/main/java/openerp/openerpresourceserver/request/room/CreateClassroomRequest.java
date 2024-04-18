package openerp.openerpresourceserver.request.room;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;
import openerp.openerpresourceserver.entity.building.ClassroomType;


@Getter
@Setter
public class CreateClassroomRequest {
    private String name;

    private Integer capacity;
    private Integer floor;

    private String description;


    private ClassroomType type;
    private Long hallId;
}
