using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Fitstore.API.Models;

[Table("cart_items")]
public class CartItem
{
    public long Id { get; set; }
    
    [Column("cart_id")]
    public long CartId { get; set; }
    [JsonIgnore]
    public Cart? Cart { get; set; }
    
    [Column("product_id")]
    public long ProductId { get; set; }
    public Product? Product { get; set; }
    
    public int Quantity { get; set; }
    
    [Column("added_at")]
    public DateTime AddedAt { get; set; }
}
