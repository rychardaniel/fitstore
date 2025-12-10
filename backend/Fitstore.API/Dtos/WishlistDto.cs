namespace Fitstore.API.Dtos;

public class WishlistItemDto
{
    public long Id { get; set; }
    public long ProductId { get; set; }
    public string? ProductName { get; set; }
    public string? ProductImage { get; set; }
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public bool InStock { get; set; }
    public DateTime AddedAt { get; set; }
}

public class WishlistDto
{
    public long Id { get; set; }
    public int TotalItems { get; set; }
    public List<WishlistItemDto> Items { get; set; } = new();
}
