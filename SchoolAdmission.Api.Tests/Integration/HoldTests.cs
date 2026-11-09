using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SchoolAdmission.Api.Data;
using SchoolAdmission.Api.Services.Interfaces;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace SchoolAdmission.Api.Tests.Integration;

public class HoldTests
{
    [Fact]
    public async Task CreateHold_ShouldReturnCreated()
    {
        using var factory =
            new CustomWebApplicationFactory();

        using var client =
            factory.CreateClient();

        var classRequest = new
        {
            name = $"Hold Test Class {Guid.NewGuid()}",
            totalSeats = 5
        };

        var classResponse =
            await client.PostAsJsonAsync(
                "/classes",
                classRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            classResponse.StatusCode);

        var createdClass =
            await classResponse.Content
                .ReadFromJsonAsync<HoldTestClassResponse>();

        Assert.NotNull(createdClass);

        var studentId =
            $"201526912345{Random.Shared.Next(100, 999)}";

        using var holdRequest =
            new HttpRequestMessage(
                HttpMethod.Post,
                $"/classes/{createdClass!.Id}/holds");

        holdRequest.Headers.Add(
            "X-Student-Id",
            studentId);

        var holdResponse =
            await client.SendAsync(holdRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            holdResponse.StatusCode);

        var hold =
            await holdResponse.Content
                .ReadFromJsonAsync<HoldTestResponse>();

        Assert.NotNull(hold);

        Assert.NotEqual(
            Guid.Empty,
            hold!.HoldId);

        Assert.Equal(
            createdClass.Id,
            hold.ClassId);

        Assert.Equal(
            studentId,
            hold.StudentId);

        Assert.Equal(
            "HELD",
            hold.Status);

        Assert.True(
            hold.ExpiresAt > DateTime.UtcNow);
    }

    [Fact]
    public async Task GetHold_ShouldReturnCreatedHold()
    {
        using var factory =
            new CustomWebApplicationFactory();

        using var client =
            factory.CreateClient();

        var classRequest = new
        {
            name = $"Get Hold Test Class {Guid.NewGuid()}",
            totalSeats = 5
        };

        var classResponse =
            await client.PostAsJsonAsync(
                "/classes",
                classRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            classResponse.StatusCode);

        var createdClass =
            await classResponse.Content
                .ReadFromJsonAsync<HoldTestClassResponse>();

        Assert.NotNull(createdClass);

        var studentId =
            $"201526912345{Random.Shared.Next(100, 999)}";

        using var holdRequest =
            new HttpRequestMessage(
                HttpMethod.Post,
                $"/classes/{createdClass!.Id}/holds");

        holdRequest.Headers.Add(
            "X-Student-Id",
            studentId);

        var holdResponse =
            await client.SendAsync(holdRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            holdResponse.StatusCode);

        var createdHold =
            await holdResponse.Content
                .ReadFromJsonAsync<HoldTestResponse>();

        Assert.NotNull(createdHold);

        var getResponse =
            await client.GetAsync(
                $"/holds/{createdHold!.HoldId}");

        Assert.Equal(
            HttpStatusCode.OK,
            getResponse.StatusCode);

        var hold =
            await getResponse.Content
                .ReadFromJsonAsync<HoldDetailsTestResponse>();

        Assert.NotNull(hold);

        Assert.Equal(
            createdHold.HoldId,
            hold!.HoldId);

        Assert.Equal(
            createdClass.Id,
            hold.ClassId);

        Assert.Equal(
            "HELD",
            hold.Status);

        Assert.True(
            hold.ExpiresAt > DateTime.UtcNow);
    }

    [Fact]
    public async Task ConfirmHold_ShouldChangeStatusToConfirmed()
    {
        using var factory =
            new CustomWebApplicationFactory();

        using var client =
            factory.CreateClient();

        var classRequest = new
        {
            name = $"Confirm Test Class {Guid.NewGuid()}",
            totalSeats = 5
        };

        var classResponse =
            await client.PostAsJsonAsync(
                "/classes",
                classRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            classResponse.StatusCode);

        var createdClass =
            await classResponse.Content
                .ReadFromJsonAsync<HoldTestClassResponse>();

        Assert.NotNull(createdClass);

        var studentId =
            $"201526912345{Random.Shared.Next(100, 999)}";

        using var holdRequest =
            new HttpRequestMessage(
                HttpMethod.Post,
                $"/classes/{createdClass!.Id}/holds");

        holdRequest.Headers.Add(
            "X-Student-Id",
            studentId);

        var holdResponse =
            await client.SendAsync(holdRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            holdResponse.StatusCode);

        var createdHold =
            await holdResponse.Content
                .ReadFromJsonAsync<HoldTestResponse>();

        Assert.NotNull(createdHold);

        using var confirmRequest =
            new HttpRequestMessage(
                HttpMethod.Post,
                $"/holds/{createdHold!.HoldId}/confirm");

        confirmRequest.Headers.Add(
            "X-Student-Id",
            studentId);

        var confirmResponse =
            await client.SendAsync(confirmRequest);

        Assert.Equal(
            HttpStatusCode.OK,
            confirmResponse.StatusCode);

        var confirmedHold =
            await confirmResponse.Content
                .ReadFromJsonAsync<HoldTestResponse>();

        Assert.NotNull(confirmedHold);

        Assert.Equal(
            createdHold.HoldId,
            confirmedHold!.HoldId);

        Assert.Equal(
            createdClass.Id,
            confirmedHold.ClassId);

        Assert.Equal(
            studentId,
            confirmedHold.StudentId);

        Assert.Equal(
            "CONFIRMED",
            confirmedHold.Status);
    }

    [Fact]
    public async Task CancelHold_ShouldReturnNoContent()
    {
        using var factory =
            new CustomWebApplicationFactory();

        using var client =
            factory.CreateClient();

        var classRequest = new
        {
            name = $"Cancel Test Class {Guid.NewGuid()}",
            totalSeats = 5
        };

        var classResponse =
            await client.PostAsJsonAsync(
                "/classes",
                classRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            classResponse.StatusCode);

        var createdClass =
            await classResponse.Content
                .ReadFromJsonAsync<HoldTestClassResponse>();

        Assert.NotNull(createdClass);

        var studentId =
            $"201526912345{Random.Shared.Next(100, 999)}";

        using var holdRequest =
            new HttpRequestMessage(
                HttpMethod.Post,
                $"/classes/{createdClass!.Id}/holds");

        holdRequest.Headers.Add(
            "X-Student-Id",
            studentId);

        var holdResponse =
            await client.SendAsync(holdRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            holdResponse.StatusCode);

        var createdHold =
            await holdResponse.Content
                .ReadFromJsonAsync<HoldTestResponse>();

        Assert.NotNull(createdHold);

        using var cancelRequest =
            new HttpRequestMessage(
                HttpMethod.Delete,
                $"/holds/{createdHold!.HoldId}");

        cancelRequest.Headers.Add(
            "X-Student-Id",
            studentId);

        var cancelResponse =
            await client.SendAsync(cancelRequest);

        Assert.Equal(
            HttpStatusCode.NoContent,
            cancelResponse.StatusCode);

        var getResponse =
            await client.GetAsync(
                $"/holds/{createdHold.HoldId}");

        Assert.Equal(
            HttpStatusCode.OK,
            getResponse.StatusCode);

        var cancelledHold =
            await getResponse.Content
                .ReadFromJsonAsync<HoldDetailsTestResponse>();

        Assert.NotNull(cancelledHold);

        Assert.Equal(
            "CANCELLED",
            cancelledHold!.Status);
    }

    [Fact]
    public async Task CreateHold_WhenClassIsFull_ShouldReturnConflict()
    {
        using var factory =
            new CustomWebApplicationFactory();

        using var client =
            factory.CreateClient();

        var classRequest = new
        {
            name = $"Full Class Test {Guid.NewGuid()}",
            totalSeats = 1
        };

        var classResponse =
            await client.PostAsJsonAsync(
                "/classes",
                classRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            classResponse.StatusCode);

        var createdClass =
            await classResponse.Content
                .ReadFromJsonAsync<HoldTestClassResponse>();

        Assert.NotNull(createdClass);

        var firstStudentId =
            $"201526912345{Random.Shared.Next(100, 999)}";

        using var firstHoldRequest =
            new HttpRequestMessage(
                HttpMethod.Post,
                $"/classes/{createdClass!.Id}/holds");

        firstHoldRequest.Headers.Add(
            "X-Student-Id",
            firstStudentId);

        var firstHoldResponse =
            await client.SendAsync(firstHoldRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            firstHoldResponse.StatusCode);

        var secondStudentId =
            $"201526912345{Random.Shared.Next(100, 999)}";

        using var secondHoldRequest =
            new HttpRequestMessage(
                HttpMethod.Post,
                $"/classes/{createdClass.Id}/holds");

        secondHoldRequest.Headers.Add(
            "X-Student-Id",
            secondStudentId);

        var secondHoldResponse =
            await client.SendAsync(secondHoldRequest);

        Assert.Equal(
            HttpStatusCode.Conflict,
            secondHoldResponse.StatusCode);
    }

    [Fact]
    public async Task CreateHold_WhenStudentAlreadyHasActiveHold_ShouldReturnConflict()
    {
        using var factory =
            new CustomWebApplicationFactory();

        using var client =
            factory.CreateClient();

        var firstClassRequest = new
        {
            name = $"Student Hold Class A {Guid.NewGuid()}",
            totalSeats = 5
        };

        var firstClassResponse =
            await client.PostAsJsonAsync(
                "/classes",
                firstClassRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            firstClassResponse.StatusCode);

        var firstClass =
            await firstClassResponse.Content
                .ReadFromJsonAsync<HoldTestClassResponse>();

        Assert.NotNull(firstClass);

        var secondClassRequest = new
        {
            name = $"Student Hold Class B {Guid.NewGuid()}",
            totalSeats = 5
        };

        var secondClassResponse =
            await client.PostAsJsonAsync(
                "/classes",
                secondClassRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            secondClassResponse.StatusCode);

        var secondClass =
            await secondClassResponse.Content
                .ReadFromJsonAsync<HoldTestClassResponse>();

        Assert.NotNull(secondClass);

        var studentId =
            $"201526912345{Random.Shared.Next(100, 999)}";

        using var firstHoldRequest =
            new HttpRequestMessage(
                HttpMethod.Post,
                $"/classes/{firstClass!.Id}/holds");

        firstHoldRequest.Headers.Add(
            "X-Student-Id",
            studentId);

        var firstHoldResponse =
            await client.SendAsync(firstHoldRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            firstHoldResponse.StatusCode);

        using var secondHoldRequest =
            new HttpRequestMessage(
                HttpMethod.Post,
                $"/classes/{secondClass!.Id}/holds");

        secondHoldRequest.Headers.Add(
            "X-Student-Id",
            studentId);

        var secondHoldResponse =
            await client.SendAsync(secondHoldRequest);

        Assert.Equal(
            HttpStatusCode.Conflict,
            secondHoldResponse.StatusCode);
    }
    [Fact]
    public async Task ExpiredHold_ShouldBecomeExpired_AndSeatShouldBecomeAvailable()
    {
        // Arrange
        using var factory =
            new CustomWebApplicationFactory();

        using var client =
            factory.CreateClient();

        var classRequest = new
        {
            name = $"Expiration Test Class {Guid.NewGuid()}",
            totalSeats = 1
        };

        var classResponse =
            await client.PostAsJsonAsync(
                "/classes",
                classRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            classResponse.StatusCode);

        var createdClass =
            await classResponse.Content
                .ReadFromJsonAsync<HoldTestClassResponse>();

        Assert.NotNull(createdClass);

        var studentId =
            $"201526912345{Random.Shared.Next(100, 999)}";

        // Create the original hold
        using var holdRequest =
            new HttpRequestMessage(
                HttpMethod.Post,
                $"/classes/{createdClass!.Id}/holds");

        holdRequest.Headers.Add(
            "X-Student-Id",
            studentId);

        var holdResponse =
            await client.SendAsync(holdRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            holdResponse.StatusCode);

        var createdHold =
            await holdResponse.Content
                .ReadFromJsonAsync<HoldTestResponse>();

        Assert.NotNull(createdHold);

        Assert.Equal(
            "HELD",
            createdHold!.Status);

        // Make the hold expired directly in the test database.
        using (var scope = factory.Services.CreateScope())
        {
            var context =
                scope.ServiceProvider
                    .GetRequiredService<AppDbContext>();

            var hold =
                await context.Holds
                    .FirstAsync(x => x.Id == createdHold.HoldId);

            hold.ExpiresAt =
                DateTime.UtcNow.AddSeconds(-1);

            await context.SaveChangesAsync();
        }

        // Run the expiration logic.
        using (var scope = factory.Services.CreateScope())
        {
            var holdService =
                scope.ServiceProvider
                    .GetRequiredService<IHoldService>();

            await holdService.ExpireHoldsAsync();
        }

        // Verify that the hold is now EXPIRED.
        var getResponse =
            await client.GetAsync(
                $"/holds/{createdHold.HoldId}");

        Assert.Equal(
            HttpStatusCode.OK,
            getResponse.StatusCode);

        var expiredHold =
            await getResponse.Content
                .ReadFromJsonAsync<HoldDetailsTestResponse>();

        Assert.NotNull(expiredHold);

        Assert.Equal(
            "EXPIRED",
            expiredHold!.Status);

        // Verify that the seat became available again
        // by allowing another student to create a hold.
        var secondStudentId =
            $"201526912345{Random.Shared.Next(100, 999)}";

        using var secondHoldRequest =
            new HttpRequestMessage(
                HttpMethod.Post,
                $"/classes/{createdClass.Id}/holds");

        secondHoldRequest.Headers.Add(
            "X-Student-Id",
            secondStudentId);

        var secondHoldResponse =
            await client.SendAsync(secondHoldRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            secondHoldResponse.StatusCode);
    }

    [Fact]
    public async Task CreateHold_ConcurrentRequests_ShouldNotExceedAvailableSeats()
    {
        // Arrange
        using var factory =
            new CustomWebApplicationFactory();

        using var client =
            factory.CreateClient();

        var classRequest = new
        {
            name = $"Concurrency Test Class {Guid.NewGuid()}",
            totalSeats = 1
        };

        var classResponse =
            await client.PostAsJsonAsync(
                "/classes",
                classRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            classResponse.StatusCode);

        var createdClass =
            await classResponse.Content
                .ReadFromJsonAsync<HoldTestClassResponse>();

        Assert.NotNull(createdClass);

        // Create 10 different students.
        var studentIds = Enumerable
            .Range(1, 10)
            .Select(i =>
                $"201526912345{100 + i}")
            .ToList();

        // Create all requests before sending them.
        var requests = studentIds.Select(studentId =>
        {
            var request =
                new HttpRequestMessage(
                    HttpMethod.Post,
                    $"/classes/{createdClass!.Id}/holds");

            request.Headers.Add(
                "X-Student-Id",
                studentId);

            return request;
        }).ToList();

        // Act - send all requests concurrently.
        var responses = await Task.WhenAll(
            requests.Select(request =>
                client.SendAsync(request)));

        // Dispose requests after all responses are completed.
        foreach (var request in requests)
        {
            request.Dispose();
        }

        // Assert - exactly one student should get the only seat.
        var createdCount =
            responses.Count(x =>
                x.StatusCode == HttpStatusCode.Created);

        var conflictCount =
            responses.Count(x =>
                x.StatusCode == HttpStatusCode.Conflict);

        Assert.Equal(1, createdCount);

        Assert.Equal(9, conflictCount);

        // Verify the class seat counts.
        var classDetailsResponse =
            await client.GetAsync(
                $"/classes/{createdClass.Id}");

        Assert.Equal(
            HttpStatusCode.OK,
            classDetailsResponse.StatusCode);

        using var json =
            JsonDocument.Parse(
                await classDetailsResponse.Content.ReadAsStringAsync());

        var root = json.RootElement;

        var heldSeats =
            root.GetProperty("heldSeats").GetInt32();

        var confirmedSeats =
            root.GetProperty("confirmedSeats").GetInt32();

        var availableSeats =
            root.GetProperty("availableSeats").GetInt32();

        // Critical assignment invariant.
        Assert.True(
            heldSeats + confirmedSeats
            <= createdClass.TotalSeats);

        Assert.Equal(
            1,
            heldSeats + confirmedSeats);

        Assert.Equal(
            0,
            availableSeats);
    }
    [Fact]
    public async Task GetMyHolds_ShouldReturnStudentHolds()
    {
        // Arrange
        using var factory =
            new CustomWebApplicationFactory();

        using var client =
            factory.CreateClient();

        var classRequest = new
        {
            name = $"My Holds Test Class {Guid.NewGuid()}",
            totalSeats = 2
        };

        var classResponse =
            await client.PostAsJsonAsync(
                "/classes",
                classRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            classResponse.StatusCode);

        var createdClass =
            await classResponse.Content
                .ReadFromJsonAsync<HoldTestClassResponse>();

        Assert.NotNull(createdClass);

        var studentId =
            $"201526912345{Random.Shared.Next(100, 999)}";

        // Create a hold
        using var holdRequest =
            new HttpRequestMessage(
                HttpMethod.Post,
                $"/classes/{createdClass!.Id}/holds");

        holdRequest.Headers.Add(
            "X-Student-Id",
            studentId);

        var holdResponse =
            await client.SendAsync(holdRequest);

        Assert.Equal(
            HttpStatusCode.Created,
            holdResponse.StatusCode);

        // Act
        using var myHoldsRequest =
            new HttpRequestMessage(
                HttpMethod.Get,
                "/me/holds");

        myHoldsRequest.Headers.Add(
            "X-Student-Id",
            studentId);

        var myHoldsResponse =
            await client.SendAsync(myHoldsRequest);

        // Assert
        Assert.Equal(
            HttpStatusCode.OK,
            myHoldsResponse.StatusCode);

        var holds =
            await myHoldsResponse.Content
                .ReadFromJsonAsync<List<HoldListTestResponse>>();

        Assert.NotNull(holds);

        Assert.Contains(
            holds!,
            x => x.ClassId == createdClass.Id
                 && x.StudentId == studentId
                 && x.Status == "HELD");
    }

}

public class HoldTestClassResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int TotalSeats { get; set; }
}

public class HoldTestResponse
{
    public Guid HoldId { get; set; }
    public Guid ClassId { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

public class HoldDetailsTestResponse
{
    public Guid HoldId { get; set; }
    public Guid ClassId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}
public class HoldListTestResponse
{
    public Guid HoldId { get; set; }
    public Guid ClassId { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}