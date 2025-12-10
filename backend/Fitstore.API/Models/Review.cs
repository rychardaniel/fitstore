using System.ComponentModel.DataAnnotations.Schema;

namespace Fitstore.API.Models;

[Table("reviews")]
public class Review
{
    public long Id { get; set; }
    
    [Column("product_id")]
    public long ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    [Column("user_id")]
    public long UserId { get; set; }
    public User User { get; set; } = null!;
    
    public int Rating { get; set; } // 1-5
    
    public string? Title { get; set; }
    
    public string? Comment { get; set; }
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
