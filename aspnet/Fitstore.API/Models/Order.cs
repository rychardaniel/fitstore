using System.ComponentModel.DataAnnotations.Schema;

namespace Fitstore.API.Models;

[Table("orders")]
public class Order
{
    public long Id { get; set; }
    public Guid Uuid { get; set; }
    
    [Column("created_at")]
    public DateOnly CreatedAt { get; set; }
    
    [Column("order_date")]
    public DateOnly OrderDate { get; set; }
    
    [Column("delivery_date")]
    public DateOnly? DeliveryDate { get; set; }
    
    [Column("total_amount")]
    public decimal TotalAmount { get; set; }
    
    public long? UserId { get; set; }
    public User? User { get; set; }
    
    public OrderStatus Status { get; set; }
    
    public List<OrderItem> Items { get; set; } = new();
}
