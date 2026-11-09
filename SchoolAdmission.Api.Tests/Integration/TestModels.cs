namespace SchoolAdmission.Api.Tests.Integration;

public class CreateClassResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int TotalSeats { get; set; }
}

public class CreateHoldResponse
{
    public Guid HoldId { get; set; }
    public Guid ClassId { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}