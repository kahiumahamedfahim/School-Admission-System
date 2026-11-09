using SchoolAdmission.Api.Entites;

namespace SchoolAdmission.Api.Entities;

public class Hold
{
    public Guid Id { get; set; }

    public Guid ClassId { get; set; }

    public SchoolClass Class { get; set; } = null!;

    public string StudentId { get; set; } = string.Empty;

    public HoldStatus Status { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ConfirmedAt { get; set; }

    public DateTime? CancelledAt { get; set; }
}