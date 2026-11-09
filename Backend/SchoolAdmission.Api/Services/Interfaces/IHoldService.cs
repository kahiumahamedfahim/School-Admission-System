using SchoolAdmission.Api.DTOs;

namespace SchoolAdmission.Api.Services.Interfaces
{
    public interface IHoldService
    {
        Task ExpireHoldsAsync();
        Task<HoldResponseDto> CreateHoldAsync(
      Guid classId,
      string studentId);
        Task<HoldDetailsResponseDto> GetHoldAsync(
    Guid holdId);

        Task<List<HoldListResponseDto>> GetAllHoldsAsync();

        Task<HoldResponseDto> ConfirmHoldAsync(
            Guid holdId, string studentId);

        Task CancelHoldAsync(
    Guid holdId,
    string studentId);
    }
}
