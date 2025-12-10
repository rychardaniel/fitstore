using System.ComponentModel.DataAnnotations.Schema;

namespace Fitstore.API.Models;

[Table("carts")]
public class Cart
{
    public long Id { get; set; }
    
    [Column("user_id")]
    public long UserId { get; set; }
    public User? User { get; set; }
    
    public List<CartItem> Items { get; set; } = new();
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
    
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }
}
