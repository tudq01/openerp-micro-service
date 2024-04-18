package openerp.openerpresourceserver.entity.building;

import jakarta.persistence.*;
import lombok.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "hall")
public class Hall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String location;

    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;


    @Column(name = "total_floor")
    private Integer totalFloor;


    public Hall(Hall hall) {
        this.id = hall.getId();
        this.name = hall.getName();
        this.location= hall.getLocation();
        this.description=hall.getDescription();
        this.status=hall.getStatus();
        this.totalFloor= hall.getTotalFloor();
    }
}
