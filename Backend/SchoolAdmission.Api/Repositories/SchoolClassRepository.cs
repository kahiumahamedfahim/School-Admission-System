using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Api.Data;
using SchoolAdmission.Api.Entites;
using SchoolAdmission.Api.Repositories.Interfaces;

namespace SchoolAdmission.Api.Repositories;

public class SchoolClassRepository
    : Repository<SchoolClass>, ISchoolClassRepository
{
    private readonly AppDbContext _context;

    public SchoolClassRepository(AppDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<SchoolClass?> GetByIdForUpdateAsync(
        Guid classId)
    {
        return await _context.SchoolClasses
            .FromSqlInterpolated($@"
                SELECT *
                FROM classes
                WHERE ""Id"" = {classId}
                FOR UPDATE")
            .AsTracking()
            .SingleOrDefaultAsync();
    }
}