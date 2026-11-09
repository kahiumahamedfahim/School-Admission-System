using SchoolAdmission.Api.Entities;

namespace SchoolAdmission.Api.DTOs;

public class HoldDetailsResponseDto
{
    public Guid HoldId { get; set; }

    public Guid ClassId { get; set; }

    public HoldStatus Status { get; set; }

    public DateTime ExpiresAt { get; set; }
}