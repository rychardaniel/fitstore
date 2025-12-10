using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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
    public int StockQuantity { get; set; }

    public string? Sku { get; set; }

    [Column("original_price")]
    public decimal? OriginalPrice { get; set; }

    public decimal? Weight { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    [JsonIgnore]
    public List<Review> Reviews { get; set; } = new();
}

