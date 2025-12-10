using System.ComponentModel.DataAnnotations.Schema;

namespace Fitstore.API.Models;

[Table("wishlists")]
public class Wishlist
{
    public long Id { get; set; }
    
    [Column("user_id")]
    public long UserId { get; set; }
    public User User { get; set; } = null!;
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public List<WishlistItem> Items { get; set; } = new();
}
