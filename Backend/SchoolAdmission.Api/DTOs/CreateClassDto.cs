using System.ComponentModel.DataAnnotations;

namespace SchoolAdmission.Api.DTOs;

public class CreateClassDto
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int TotalSeats { get; set; }
}