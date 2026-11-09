using SchoolAdmission.Api.DTOs;
using SchoolAdmission.Api.Entites;

namespace SchoolAdmission.Api.Services.Interfaces;

public interface ISchoolClassService
{
    Task<SchoolClass> CreateClassAsync(CreateClassDto dto);
    Task<List<ClassResponseDto>> GetClassesAsync();
    Task<ClassResponseDto> GetClassAsync(Guid classId);
}