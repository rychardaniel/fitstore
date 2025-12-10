using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Fitstore.API.Models;

[Table("users")]
public class User
{
    public long Id { get; set; }

    [Column("full_name")]
    public string? FullName { get; set; }

    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public bool Active { get; set; }

    [Column("created_at")]
    public DateOnly CreatedAt { get; set; }

    [Column("zip_code")]
    public string? ZipCode { get; set; }
    public string? Email { get; set; }

    [JsonIgnore]
    public string? Password { get; set; }

    public string? Phone { get; set; }

    public string Role { get; set; } = "Client";

    [JsonIgnore]
    public Cart? Cart { get; set; }

    [JsonIgnore]
    public List<Order> Orders { get; set; } = new();

    [JsonIgnore]
    public List<Review> Reviews { get; set; } = new();

    [JsonIgnore]
    public Wishlist? Wishlist { get; set; }
}

