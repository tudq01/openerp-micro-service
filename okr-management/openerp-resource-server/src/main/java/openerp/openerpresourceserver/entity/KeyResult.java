package openerp.openerpresourceserver.entity;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import openerp.openerpresourceserver.request.target.CreateOkrRequest;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "okr_key_result")
public class KeyResult {

    public KeyResult(CreateOkrRequest keyResult) {
        this.title = keyResult.getTitle();
        this.progress = keyResult.getProgress();
        this.fromDate = keyResult.getFromDate();
        this.toDate = keyResult.getToDate();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Integer progress;
    private Date fromDate;
    private Date toDate;
    @Column(name = "target_id")
    private Long targetId;

    @JoinColumn(name = "target_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Target target;

    @CreationTimestamp
    @Column(name = "created_stamp")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "last_updated_stamp")
    private Date updatedAt;

}
