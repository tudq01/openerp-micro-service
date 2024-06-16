package openerp.openerpresourceserver.request.target;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateOkrRequest {
    String title;
    Integer progress;
    Date fromDate;
    Date toDate;
    Integer weighted;
}
