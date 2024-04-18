package openerp.openerpresourceserver.entity;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "okr_target_result")
public class TargetResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String selfComment;
    private String selfRank;
    private String managerRank;
    private String managerComment;
    @Column(name = "target_id")
    private Long targetId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "target_id", nullable = false, referencedColumnName = "id", insertable = false, updatable = false)
    private Target target;

    @CreationTimestamp
    @Column(name = "created_stamp")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "last_updated_stamp")
    private Date updatedAt;
}
