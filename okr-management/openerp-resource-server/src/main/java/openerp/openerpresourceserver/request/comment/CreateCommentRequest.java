package openerp.openerpresourceserver.request.comment;

import lombok.Getter;

@Getter
public class CreateCommentRequest {
    String message;
    Long parentId;
}
