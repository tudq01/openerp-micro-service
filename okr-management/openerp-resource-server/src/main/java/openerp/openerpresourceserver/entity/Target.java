package openerp.openerpresourceserver.entity;

import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "okr_target")
public class Target {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Integer progress;
    private Date fromDate;
    private Date toDate;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "key_result_id")
    private Long keyResultId;

    @Column(name = "target_category_id")
    private Integer targetCategoryId;

    @Column(name = "period_id")
    private Long periodId;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "team_id")
    private Long teamId;

    @JoinColumn(name = "parent_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    // @JsonIgnore
    private Target parentTarget;

    @JoinColumn(name = "team_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Team team;

    @Enumerated(EnumType.STRING)
    private TargetStatus status;

    @Enumerated(EnumType.STRING)
    private TargetType type;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "target", cascade = CascadeType.ALL)
    private List<KeyResult> keyResults;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    // to join but not update inside nested with insertable and updatable
    @JoinColumn(name = "user_id", nullable = false, referencedColumnName = "user_login_id", insertable = false, updatable = false)
    // @JsonIgnore it will not show nested join data
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "key_result_id", nullable = false, referencedColumnName = "id", insertable = false, updatable = false)
    // @JsonIgnore it will not show nested join data
    private KeyResult keyResult;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "period_id", nullable = false, referencedColumnName = "id", insertable = false, updatable = false)
    // @JsonIgnore it will not show nested join data
    private TargetPeriod period;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "target_category_id", nullable = false, referencedColumnName = "id", insertable = false, updatable = false)
    // @JsonIgnore
    private TargetCategory targetType;

    @Column(name = "approved_at")
    private Date approvedAt;

    @CreationTimestamp
    @Column(name = "created_stamp")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "last_updated_stamp")
    private Date updatedAt;

}
