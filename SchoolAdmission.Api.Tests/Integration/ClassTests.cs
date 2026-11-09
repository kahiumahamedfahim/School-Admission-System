using System.Net;
using System.Net.Http.Json;

namespace SchoolAdmission.Api.Tests.Integration;

public class ClassTests
{
    [Fact]
    public async Task GetClasses_ShouldReturnSuccess()
    {
        using var factory =
            new CustomWebApplicationFactory();

        using var client =
            factory.CreateClient();

        var response =
            await client.GetAsync("/classes");

        Assert.Equal(
            HttpStatusCode.OK,
            response.StatusCode);
    }

    [Fact]
    public async Task CreateClass_ShouldReturnCreated_AndPersistData()
    {
        using var factory =
            new CustomWebApplicationFactory();

        using var client =
            factory.CreateClient();

        var className =
            $"Test Class {Guid.NewGuid()}";

        var request = new
        {
            name = className,
            totalSeats = 30
        };

        var response =
            await client.PostAsJsonAsync(
                "/classes",
                request);

        Assert.Equal(
            HttpStatusCode.Created,
            response.StatusCode);

        var createdClass =
            await response.Content
                .ReadFromJsonAsync<CreateClassResponse>();

        Assert.NotNull(createdClass);

        Assert.NotEqual(
            Guid.Empty,
            createdClass!.Id);

        Assert.Equal(
            className,
            createdClass.Name);

        Assert.Equal(
            30,
            createdClass.TotalSeats);
    }
}

