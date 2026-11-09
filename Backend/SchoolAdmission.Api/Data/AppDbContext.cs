using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Api.Entites;
using SchoolAdmission.Api.Entities;

namespace SchoolAdmission.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {

        }

        public DbSet<SchoolClass> SchoolClasses { get; set; }
        public DbSet<Hold> Holds
        {
            get; set;
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(AppDbContext).Assembly
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}
