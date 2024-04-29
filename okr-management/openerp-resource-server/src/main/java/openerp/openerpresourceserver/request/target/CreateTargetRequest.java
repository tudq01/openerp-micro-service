package openerp.openerpresourceserver.request.target;

import java.util.ArrayList;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTargetRequest {
    String title;
    Integer progress;
    Date fromDate;
    Date toDate;
    // target status
    String status;
    String type;
    Long periodId;

    String userId;
    // String reviewerId;
    Integer targetCategoryId;

    ArrayList<CreateOkrRequest> keyResults;
}
