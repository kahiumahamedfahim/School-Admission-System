using SchoolAdmission.Api.Entites;

namespace SchoolAdmission.Api.Repositories.Interfaces;

public interface ISchoolClassRepository : IRepository<SchoolClass>
{
    Task<SchoolClass?> GetByIdForUpdateAsync(Guid classId);
}