using System.ComponentModel.DataAnnotations.Schema;

namespace Fitstore.API.Models;

[Table("wishlist_items")]
public class WishlistItem
{
    public long Id { get; set; }
    
    [Column("wishlist_id")]
    public long WishlistId { get; set; }
    public Wishlist Wishlist { get; set; } = null!;
    
    [Column("product_id")]
    public long ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    [Column("added_at")]
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
