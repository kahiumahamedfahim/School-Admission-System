using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SchoolAdmission.Api.Entites;

namespace SchoolAdmission.Api.Data.Configurations
{
    public class SchoolClassConfiguration :
        IEntityTypeConfiguration<SchoolClass>
    {
        public void Configure(EntityTypeBuilder<SchoolClass> builder)
        {
            builder.ToTable("classes");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .ValueGeneratedOnAdd();

            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(x => x.TotalSeats)
                .IsRequired();

            builder.Property(x => x.CreatedAt)
                .IsRequired();

            builder.HasIndex(x => x.Name);


        }
    }
}
