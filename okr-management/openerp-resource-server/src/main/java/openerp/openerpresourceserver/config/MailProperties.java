package openerp.openerpresourceserver.config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;


@Getter
@AllArgsConstructor

@ConfigurationProperties(prefix = "spring.mail")
/**
 * @author Le Anh Tuan
 */
public class MailProperties {

    //    @NotBlank
    private String username;
}
