using SchoolAdmission.Api.DTOs;
using SchoolAdmission.Api.Entites;
using SchoolAdmission.Api.Entities;
using SchoolAdmission.Api.Repositories.Interfaces;
using SchoolAdmission.Api.Services.Interfaces;

namespace SchoolAdmission.Api.Services;

public class SchoolClassService : ISchoolClassService
{
    private readonly IRepository<SchoolClass> _classRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHoldRepository _holdRepository;
    private readonly ISchoolClassRepository _schoolClassRepository;

    public SchoolClassService(
        IRepository<SchoolClass> classRepository, IUnitOfWork unitOfWork,
        IHoldRepository holdRepository)
    {
        _classRepository = classRepository;
        _unitOfWork = unitOfWork;
        _holdRepository = holdRepository;
    }

    public async Task<SchoolClass> CreateClassAsync(CreateClassDto dto)
    {
        var schoolClass = new SchoolClass
        {
            Name = dto.Name,
            TotalSeats = dto.TotalSeats
        };

        await _classRepository.AddAsync(schoolClass);
        await _unitOfWork.SaveChangesAsync();

        return schoolClass;
    }
    public async Task<List<ClassResponseDto>> GetClassesAsync()
    {
        try
        {
            var classes = await _classRepository.GetAllAsync();

            var holds = await _holdRepository.GetAllAsync();

            if (classes == null || classes.Count == 0)
            {
                return new List<ClassResponseDto>();
            }
            else
            {
                var result = classes.Select(x =>
                {
                    var heldSeats = holds.Count(h =>
    h.ClassId == x.Id &&
    h.Status == HoldStatus.HELD &&
    h.ExpiresAt > DateTime.UtcNow);

                    var confirmedSeats = holds.Count(h =>
                        h.ClassId == x.Id &&
                        h.Status == HoldStatus.CONFIRMED);

                    var availableSeats =
                        x.TotalSeats - heldSeats - confirmedSeats;

                    return new ClassResponseDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        TotalSeats = x.TotalSeats,
                        HeldSeats = heldSeats,
                        ConfirmedSeats = confirmedSeats,
                        AvailableSeats = availableSeats
                    };
                }).ToList();

                return result;
            }
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<ClassResponseDto> GetClassAsync(
    Guid classId)
    {
        try
        {
            var schoolClass =
                await _classRepository.GetByIdAsync(classId);

            if (schoolClass == null)
            {
                throw new KeyNotFoundException(
                    "Class not found.");
            }

            var heldSeats =
                await _holdRepository.CountActiveHeldSeatsAsync(
                    classId);

            var confirmedSeats =
                await _holdRepository.CountConfirmedSeatsAsync(
                    classId);

            var availableSeats =
                schoolClass.TotalSeats
                - heldSeats
                - confirmedSeats;

            return new ClassResponseDto
            {
                Id = schoolClass.Id,
                Name = schoolClass.Name,
                TotalSeats = schoolClass.TotalSeats,
                HeldSeats = heldSeats,
                ConfirmedSeats = confirmedSeats,
                AvailableSeats = availableSeats
            };
        }
        catch (Exception)
        {
            throw;
        }
    }
}