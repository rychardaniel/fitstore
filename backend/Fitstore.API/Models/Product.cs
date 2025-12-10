using System.ComponentModel.DataAnnotations.Schema;

namespace Fitstore.API.Models;

[Table("products")]
public class Product
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    
    public long? CategoryId { get; set; }
    public Category? Category { get; set; }
    
    public long? BrandId { get; set; }
    public Brand? Brand { get; set; }
    
    public bool Active { get; set; }
    public string? Image { get; set; }
    public decimal Price { get; set; }
    
    [Column("stock_quantity")]
    public decimal StockQuantity { get; set; }
}
