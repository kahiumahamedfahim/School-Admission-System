using Microsoft.AspNetCore.Mvc;
using SchoolAdmission.Api.Services.Interfaces;

namespace SchoolAdmission.Api.Controllers;

[ApiController]
public class HoldsController : ControllerBase
{
    private readonly IHoldService _holdService;

    public HoldsController(IHoldService holdService)
    {
        _holdService = holdService;
    }

    [HttpPost("classes/{classId}/holds")]
    public async Task<IActionResult> CreateHold(
        Guid classId,
        [FromHeader(Name = "X-Student-Id")] string studentId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(studentId))
            {
                return BadRequest(new
                {
                    message = "X-Student-Id header is required."
                });
            }

            var result = await _holdService.CreateHoldAsync(
                classId,
                studentId);

            return StatusCode(
                StatusCodes.Status201Created,
                result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
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
                        "An unexpected error occurred while creating the hold."
                });
        }
    }

    [HttpGet("holds/{holdId}")]
    public async Task<IActionResult> GetHold(
    Guid holdId)
    {
        try
        {
            var result =
                await _holdService.GetHoldAsync(holdId);

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
                        "An unexpected error occurred while retrieving the hold."
                });
        }
    }

    [HttpGet("holds")]
    public async Task<IActionResult> GetAllHolds()
    {
        try
        {
            var result =
                await _holdService.GetAllHoldsAsync();

            return Ok(result);
        }
        catch (Exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message =
                        "An unexpected error occurred while retrieving holds."
                });
        }
    }

    [HttpPost("holds/{holdId}/confirm")]
    public async Task<IActionResult> ConfirmHold(
    Guid holdId,
    [FromHeader(Name = "X-Student-Id")] string studentId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(studentId))
            {
                return BadRequest(new
                {
                    message = "X-Student-Id header is required."
                });
            }

            var result =
                await _holdService.ConfirmHoldAsync(
                    holdId,
                    studentId);

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new
                {
                    message = ex.Message
                });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
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
                        "An unexpected error occurred while confirming the hold."
                });
        }
    }

    [HttpDelete("holds/{holdId}")]
    public async Task<IActionResult> CancelHold(
    Guid holdId,
    [FromHeader(Name = "X-Student-Id")] string studentId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(studentId))
            {
                return BadRequest(new
                {
                    message = "X-Student-Id header is required."
                });
            }

            await _holdService.CancelHoldAsync(
                holdId,
                studentId);

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new
                {
                    message = ex.Message
                });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
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
                        "An unexpected error occurred while cancelling the hold."
                });
        }
    }

    [HttpGet("me/holds")]
    public async Task<IActionResult> GetMyHolds()
    {
        try
        {
            if (!Request.Headers.TryGetValue(
                    "X-Student-Id",
                    out var studentId))
            {
                return BadRequest(new
                {
                    message = "X-Student-Id header is required."
                });
            }

            var holds =
                await _holdService.GetMyHoldsAsync(
                    studentId.ToString());

            return Ok(holds);
        }
        catch (Exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message = "An unexpected error occurred."
                });
        }
    }
}