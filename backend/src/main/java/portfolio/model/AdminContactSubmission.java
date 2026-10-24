
package portfolio.model;

import java.time.LocalDate;
import java.util.Objects;

import jakarta.persistence.*;

@Entity
@Table(name = "admin_contact_submission")
public class AdminContactSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_profile_id", nullable = false)
    private Admin admin;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 254)
    private String email;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "submission_date", nullable = false)
    private LocalDate submissionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ContactStatus status = ContactStatus.UNREAD;

    @Column(name = "is_archived", nullable = false)
    private boolean archived = false;

    public enum ContactStatus {
        READ, UNREAD
    }

    public AdminContactSubmission() {
    }

    @PrePersist
    protected void onCreate() {
        if (submissionDate == null) {
            submissionDate = LocalDate.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Admin getAdmin() { return admin; }
    public void setAdmin(Admin admin) { this.admin = admin; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDate getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDate submissionDate) {
        this.submissionDate = submissionDate;
    }

    public ContactStatus getStatus() { return status; }
    public void setStatus(ContactStatus status) { this.status = status; }

    public boolean isArchived() { return archived; }
    public void setArchived(boolean archived) {
        this.archived = archived;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) return true;
        if(!(o instanceof AdminContactSubmission)) return false;
        AdminContactSubmission adminContactSubmission = (AdminContactSubmission) o;
        return Objects.equals(id, adminContactSubmission.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "adminContactSubmission [id = " + id + ", name = " + name + "email = " + email +
                ", message = " + message + ", submissionDate = " + submissionDate +
                ", status = " + status + ", archived = " + archived + "]";
    }
}


