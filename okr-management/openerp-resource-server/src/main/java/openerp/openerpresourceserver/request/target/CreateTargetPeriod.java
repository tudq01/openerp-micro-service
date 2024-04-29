package openerp.openerpresourceserver.request.target;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTargetPeriod {
    String title;
    Date fromDate;
    Date toDate;
}
