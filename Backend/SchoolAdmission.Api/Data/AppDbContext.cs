using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Api.Entites;

namespace SchoolAdmission.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {

        }

        public DbSet<SchoolClass> SchoolClasses { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(AppDbContext).Assembly
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}
