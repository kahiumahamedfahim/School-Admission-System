using SchoolAdmission.Api.Services.Interfaces;

namespace SchoolAdmission.Api.Services;

public class HoldExpirationBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public HoldExpirationBackgroundService(
        IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope =
                    _scopeFactory.CreateScope();

                var holdService =
                    scope.ServiceProvider
                        .GetRequiredService<IHoldService>();

                await holdService.ExpireHoldsAsync();
            }
            catch (Exception)
            {
                // Keep the background service running
            }

            await Task.Delay(
                TimeSpan.FromSeconds(5),
                stoppingToken);
        }
    }
}