using Microsoft.EntityFrameworkCore.Storage;

namespace SchoolAdmission.Api.Repositories.Interfaces;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync();
    Task<IDbContextTransaction> BeginTransactionAsync();
}