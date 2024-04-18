package openerp.openerpresourceserver.entity;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "okr_user_manager")
public class UserManger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private String userId;
    @Column(name = "manager_id")
    private String managerId;

    @JoinColumn(name = "user_id", referencedColumnName = "user_login_id", insertable = false, updatable = false)
    @ManyToOne
    private User user;

    @JoinColumn(name = "manager_id", referencedColumnName = "user_login_id", insertable = false, updatable = false)
    @ManyToOne
    private User manager;

    @CreationTimestamp
    @Column(name = "created_stamp")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "last_updated_stamp")
    private Date updatedAt;

}

// @Id
// @GeneratedValue(strategy = GenerationType.AUTO)
// private UUID id;
