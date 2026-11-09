using Microsoft.AspNetCore.Mvc;
using SchoolAdmission.Api.DTOs;
using SchoolAdmission.Api.Services.Interfaces;

namespace SchoolAdmission.Api.Controllers;

[ApiController]
[Route("classes")]
public class SchoolClassesController : ControllerBase
{
    private readonly ISchoolClassService _schoolClassService;

    public SchoolClassesController(
        ISchoolClassService schoolClassService)
    {
        _schoolClassService = schoolClassService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateClass(
        CreateClassDto dto)
    {
        var result = await _schoolClassService
            .CreateClassAsync(dto);

        return StatusCode(
            StatusCodes.Status201Created,
            new
            {
                id = result.Id,
                name = result.Name,
                totalSeats = result.TotalSeats
            }
        );
    }

    [HttpGet]
    public async Task<IActionResult> GetClasses()
    {
        try
        {
            var result = await _schoolClassService.GetClassesAsync();

            if (result == null || result.Count == 0)
            {
                return Ok(new List<ClassResponseDto>());
            }
            else
            {
                return Ok(result);
            }
        }
        catch (Exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message = "An unexpected error occurred while retrieving classes."
                }
            );
        }
    }

    [HttpGet("{classId}")]
    public async Task<IActionResult> GetClass(Guid classId)
    {
        try
        {
            var result =
                await _schoolClassService.GetClassAsync(classId);

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (Exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message =
                        "An unexpected error occurred while retrieving the class."
                });
        }
    }
}