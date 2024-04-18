package openerp.openerpresourceserver.request.hall;


import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.entity.building.Status;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HallRequest {

    @NotBlank
    @Size(max = 200, message = "Name cannot exceed 200 characters")
    private String name;


    private String location;

    private String description;



    private Status status;



    private Integer totalFloor;
}
