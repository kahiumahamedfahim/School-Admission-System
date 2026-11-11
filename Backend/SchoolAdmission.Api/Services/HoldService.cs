using SchoolAdmission.Api.DTOs;
using SchoolAdmission.Api.Entities;
using SchoolAdmission.Api.Repositories.Interfaces;
using SchoolAdmission.Api.Services.Interfaces;

namespace SchoolAdmission.Api.Services;

public class HoldService : IHoldService
{
    private readonly IHoldRepository _holdRepository;
    private readonly ISchoolClassRepository _schoolClassRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;

    public HoldService(
        IHoldRepository holdRepository,
        ISchoolClassRepository schoolClassRepository,
        IUnitOfWork unitOfWork,
        IConfiguration configuration)
    {
        _holdRepository = holdRepository;
        _schoolClassRepository = schoolClassRepository;
        _unitOfWork = unitOfWork;
        _configuration = configuration;
    }

    public async Task ExpireHoldsAsync()
    {
        try
        {
            var expiredHolds =
                await _holdRepository.GetExpiredHeldAsync();

            if (expiredHolds == null || expiredHolds.Count == 0)
            {
                return;
            }
            else
            {
                foreach (var hold in expiredHolds)
                {
                    hold.Status = HoldStatus.EXPIRED;

                    _holdRepository.Update(hold);
                }

                await _unitOfWork.SaveChangesAsync();
            }
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<HoldResponseDto> CreateHoldAsync(
     Guid classId,
     string studentId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(studentId))
            {
                throw new ArgumentException(
                    "Student ID is required.");
            }

            var holdDurationSeconds =
                _configuration.GetValue<int?>(
                    "HOLD_DURATION_SECONDS")
                ?? 600;

            var transaction =
                await _unitOfWork.BeginTransactionAsync();

            try
            {
                await _holdRepository.AcquireStudentHoldLockAsync(
                    studentId);

                var schoolClass =
                    await _schoolClassRepository
                        .GetByIdForUpdateAsync(classId);

                if (schoolClass == null)
                {
                    throw new KeyNotFoundException(
                        "Class not found.");
                }

                var now = DateTime.UtcNow;

                var hasActiveHold =
                    await _holdRepository
                        .HasActiveHoldForStudentAsync(
                            studentId);

                if (hasActiveHold)
                {
                    throw new InvalidOperationException(
                        "Student already has an active hold.");
                }

                var hasConfirmedAdmission =
                    await _holdRepository
                        .HasConfirmedAdmissionForStudentAsync(
                            studentId);

                if (hasConfirmedAdmission)
                {
                    throw new InvalidOperationException(
                        "Student already has a confirmed admission.");
                }

                var heldSeats =
                    await _holdRepository
                        .CountActiveHeldSeatsAsync(classId);

                var confirmedSeats =
                    await _holdRepository
                        .CountConfirmedSeatsAsync(classId);

                var occupiedSeats =
                    heldSeats + confirmedSeats;

                if (occupiedSeats >= schoolClass.TotalSeats)
                {
                    throw new InvalidOperationException(
                        "No seats are available for this class.");
                }

                var hold = new Hold
                {
                    Id = Guid.NewGuid(),
                    ClassId = classId,
                    StudentId = studentId,
                    Status = HoldStatus.HELD,
                    ExpiresAt =
                        now.AddSeconds(holdDurationSeconds),
                    CreatedAt = now
                };

                await _holdRepository.AddAsync(hold);

                await _unitOfWork.SaveChangesAsync();

                await transaction.CommitAsync();

                return new HoldResponseDto
                {
                    HoldId = hold.Id,
                    ClassId = hold.ClassId,
                    StudentId = hold.StudentId,
                    Status = hold.Status,
                    ExpiresAt = hold.ExpiresAt
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<HoldDetailsResponseDto> GetHoldAsync(
    Guid holdId)
    {
        try
        {
            var hold =
                await _holdRepository.GetByIdAsync(holdId);

            if (hold == null)
            {
                throw new KeyNotFoundException(
                    "Hold not found.");
            }

            return new HoldDetailsResponseDto
            {
                HoldId = hold.Id,
                ClassId = hold.ClassId,
                Status = hold.Status,
                ExpiresAt = hold.ExpiresAt
            };
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<List<HoldListResponseDto>> GetAllHoldsAsync()
    {
        try
        {
            var holds = await _holdRepository.GetAllAsync();

            if (holds == null || holds.Count == 0)
            {
                return new List<HoldListResponseDto>();
            }
            else
            {
                return holds
                    .Select(x => new HoldListResponseDto
                    {
                        HoldId = x.Id,
                        ClassId = x.ClassId,
                        StudentId = x.StudentId,
                        Status = x.Status,
                        ExpiresAt = x.ExpiresAt
                    })
                    .ToList();
            }
        }
        catch (Exception)
        {
            throw;
        }
    }
    public async Task<HoldResponseDto> ConfirmHoldAsync(
    Guid holdId,
    string studentId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(studentId))
            {
                throw new ArgumentException(
                    "Student ID is required.");
            }

            var transaction =
                await _unitOfWork.BeginTransactionAsync();

            try
            {
                // First, find the hold so we can know its ClassId.
                var existingHold =
                    await _holdRepository.GetByIdAsync(holdId);

                if (existingHold == null)
                {
                    throw new KeyNotFoundException(
                        "Hold not found.");
                }

                // Lock the class row.
                var schoolClass =
                    await _schoolClassRepository
                        .GetByIdForUpdateAsync(
                            existingHold.ClassId);

                if (schoolClass == null)
                {
                    throw new KeyNotFoundException(
                        "Class not found.");
                }

                // Now get the hold with row-level lock.
                var hold =
                    await _holdRepository
                        .GetByIdForUpdateAsync(holdId);

                if (hold == null)
                {
                    throw new KeyNotFoundException(
                        "Hold not found.");
                }

                // Verify that this student owns the hold.
                if (hold.StudentId != studentId)
                {
                    throw new UnauthorizedAccessException(
                        "You are not allowed to confirm this hold.");
                }

                // Only HELD status can be confirmed.
                if (hold.Status != HoldStatus.HELD)
                {
                    throw new InvalidOperationException(
                        "Only an active hold can be confirmed.");
                }

                // Check expiration.
                var now = DateTime.UtcNow;

                if (hold.ExpiresAt <= now)
                {
                    throw new InvalidOperationException(
                        "This hold has expired.");
                }

                // Confirm the hold.
                hold.Status = HoldStatus.CONFIRMED;
                hold.ConfirmedAt = now;

                _holdRepository.Update(hold);

                await _unitOfWork.SaveChangesAsync();

                await transaction.CommitAsync();

                return new HoldResponseDto
                {
                    HoldId = hold.Id,
                    ClassId = hold.ClassId,
                    StudentId = hold.StudentId,
                    Status = hold.Status,
                    ExpiresAt = hold.ExpiresAt
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task CancelHoldAsync(
    Guid holdId,
    string studentId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(studentId))
            {
                throw new ArgumentException(
                    "Student ID is required.");
            }

            var transaction =
                await _unitOfWork.BeginTransactionAsync();

            try
            {
                // First find the hold to know its class.
                var existingHold =
                    await _holdRepository.GetByIdAsync(holdId);

                if (existingHold == null)
                {
                    throw new KeyNotFoundException(
                        "Hold not found.");
                }

                // Lock the class row.
                var schoolClass =
                    await _schoolClassRepository
                        .GetByIdForUpdateAsync(
                            existingHold.ClassId);

                if (schoolClass == null)
                {
                    throw new KeyNotFoundException(
                        "Class not found.");
                }

                // Get the latest hold with row lock.
                var hold =
                    await _holdRepository
                        .GetByIdForUpdateAsync(holdId);

                if (hold == null)
                {
                    throw new KeyNotFoundException(
                        "Hold not found.");
                }

                // Verify ownership.
                if (hold.StudentId != studentId)
                {
                    throw new UnauthorizedAccessException(
                        "You are not allowed to cancel this hold.");
                }

                // Only HELD can be cancelled.
                if (hold.Status != HoldStatus.HELD)
                {
                    throw new InvalidOperationException(
                        "Only an active hold can be cancelled.");
                }

                hold.Status = HoldStatus.CANCELLED;
                hold.CancelledAt = DateTime.UtcNow;

                _holdRepository.Update(hold);

                await _unitOfWork.SaveChangesAsync();

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        catch (Exception)
        {
            throw;
        }
    }


    public async Task<List<HoldListResponseDto>> GetMyHoldsAsync(
    string studentId)
    {
        try
        {
            var holds =
                await _holdRepository.GetByStudentIdAsync(studentId);

            return holds.Select(x => new HoldListResponseDto
            {
                HoldId = x.Id,
                ClassId = x.ClassId,
                StudentId = x.StudentId,
                Status = x.Status,
                ExpiresAt = x.ExpiresAt
            }).ToList();
        }
        catch (Exception)
        {
            throw;
        }
    }
}