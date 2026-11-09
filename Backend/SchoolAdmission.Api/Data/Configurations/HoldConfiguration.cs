using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SchoolAdmission.Api.Entities;

namespace SchoolAdmission.Api.Data.Configurations;

public class HoldConfiguration : IEntityTypeConfiguration<Hold>
{
    public void Configure(EntityTypeBuilder<Hold> builder)
    {
        builder.ToTable("holds");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .ValueGeneratedOnAdd();

        builder.Property(x => x.StudentId)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Status)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(x => x.ExpiresAt)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.ConfirmedAt)
            .IsRequired(false);

        builder.Property(x => x.CancelledAt)
            .IsRequired(false);

        builder.HasOne(x => x.Class)
            .WithMany(x => x.Holds)
            .HasForeignKey(x => x.ClassId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.ClassId);

        builder.HasIndex(x => x.StudentId);

        builder.HasIndex(x => x.Status);
    }
}