package openerp.openerpresourceserver.request.target;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTargetResult {
    String selfComment;
    String selfRank;
    String managerComment;
    String managerRank;
}
