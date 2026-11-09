using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Api.Data;
using SchoolAdmission.Api.Entities;
using SchoolAdmission.Api.Repositories.Interfaces;

namespace SchoolAdmission.Api.Repositories;

public class HoldRepository
    : Repository<Hold>, IHoldRepository
{
    private readonly AppDbContext _context;

    public HoldRepository(AppDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<List<Hold>> GetExpiredHeldAsync()
    {
        return await _context.Set<Hold>()
            .Where(x =>
                x.Status == HoldStatus.HELD &&
                x.ExpiresAt <= DateTime.UtcNow)
            .ToListAsync();
    }

    public async Task<bool> HasActiveHoldForStudentAsync(
     string studentId)
    {
        return await _context.Set<Hold>()
            .AnyAsync(x =>
                x.StudentId == studentId &&
                x.Status == HoldStatus.HELD &&
                x.ExpiresAt > DateTime.UtcNow);
    }

    public async Task<int> CountActiveHeldSeatsAsync(
        Guid classId)
    {
        return await _context.Set<Hold>()
            .CountAsync(x =>
                x.ClassId == classId &&
                x.Status == HoldStatus.HELD &&
                x.ExpiresAt > DateTime.UtcNow);
    }

    public async Task<int> CountConfirmedSeatsAsync(
        Guid classId)
    {
        return await _context.Set<Hold>()
            .CountAsync(x =>
                x.ClassId == classId &&
                x.Status == HoldStatus.CONFIRMED);
    }
    public async Task<Hold?> GetByIdForUpdateAsync(
    Guid holdId)
    {
        return await _context.Set<Hold>()
            .FromSqlInterpolated($@"
            SELECT *
            FROM holds
            WHERE ""Id"" = {holdId}
            FOR UPDATE")
            .AsTracking()
            .SingleOrDefaultAsync();
    }

    public async Task AcquireStudentHoldLockAsync(
    string studentId)
    {
        await _context.Database.ExecuteSqlInterpolatedAsync($@"
        SELECT pg_advisory_xact_lock(
            hashtextextended({studentId}, 0)
        )");
    }
    public async Task<List<Hold>> GetByStudentIdAsync(string studentId)
    {
        return await _context.Set<Hold>()
            .Where(x => x.StudentId == studentId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }
}