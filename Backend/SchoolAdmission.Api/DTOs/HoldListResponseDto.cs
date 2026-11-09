using SchoolAdmission.Api.Entities;

namespace SchoolAdmission.Api.DTOs;

public class HoldListResponseDto
{
    public Guid HoldId { get; set; }

    public Guid ClassId { get; set; }

    public string StudentId { get; set; } = string.Empty;

    public HoldStatus Status { get; set; }

    public DateTime ExpiresAt { get; set; }
}