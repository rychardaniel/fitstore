using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Fitstore.API.Models;

[Table("order_items")]
public class OrderItem
{
    public long Id { get; set; }
    
    public long? ProductId { get; set; }
    public Product? Product { get; set; }
    
    public long? OrderId { get; set; }
    [JsonIgnore]
    public Order? Order { get; set; }
    
    [Column("unit_price")]
    public decimal UnitPrice { get; set; }
    
    public decimal Quantity { get; set; }
}
