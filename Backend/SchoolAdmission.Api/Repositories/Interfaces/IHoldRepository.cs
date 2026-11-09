using SchoolAdmission.Api.Entities;

namespace SchoolAdmission.Api.Repositories.Interfaces;

public interface IHoldRepository : IRepository<Hold>
{
    Task<List<Hold>> GetExpiredHeldAsync();
    Task<bool> HasActiveHoldForStudentAsync(
    string studentId);

    Task<int> CountActiveHeldSeatsAsync(
        Guid classId);

    Task<int> CountConfirmedSeatsAsync(
        Guid classId);
    Task<Hold?> GetByIdForUpdateAsync(
    Guid holdId);
    Task AcquireStudentHoldLockAsync(
    string studentId);
}