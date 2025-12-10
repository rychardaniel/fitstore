namespace Fitstore.API.Dtos;

public class UserDetailsDto
{
    public long Id { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public bool Active { get; set; }
    public DateOnly CreatedAt { get; set; }
    public string Role { get; set; } = "Client";
}
