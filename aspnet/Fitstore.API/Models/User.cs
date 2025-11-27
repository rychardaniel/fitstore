using System.ComponentModel.DataAnnotations.Schema;

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
    public string? Password { get; set; }
}
