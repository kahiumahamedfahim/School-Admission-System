using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace SchoolAdmission.Api.Tests.Integration;

public class CustomWebApplicationFactory
    : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(
        IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration(
            (context, config) =>
            {
                var testConnectionString =
                    "Host=localhost;" +
                    "Port=5432;" +
                    "Database=school_admission_test_db;" +
                    "Username=postgres;" +
                    "Password=root";

                config.AddInMemoryCollection(
                    new Dictionary<string, string?>
                    {
                        {
                            "ConnectionStrings:DefaultConnection",
                            testConnectionString
                        }
                    });
            });
    }
}