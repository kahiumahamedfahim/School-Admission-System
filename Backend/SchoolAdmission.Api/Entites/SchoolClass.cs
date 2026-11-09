using SchoolAdmission.Api.Entities;

namespace SchoolAdmission.Api.Entites
{
    public class SchoolClass
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public int TotalSeats { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Hold> Holds { get; set; } = new List<Hold>();
    }
}
