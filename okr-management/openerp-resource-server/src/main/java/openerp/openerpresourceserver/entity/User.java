package openerp.openerpresourceserver.entity;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_login")
public class User {

    @Id
    @Column(name = "user_login_id", updatable = false, nullable = false)
    private String id;

    private String email;

    private String firstName;

    private String lastName;

    private boolean enabled;

    @CreationTimestamp
    @Column(name = "created_stamp")
    private Date createdDate;

    @UpdateTimestamp
    @Column(name = "last_updated_stamp")
    private Date lastModifiedDate;

}
