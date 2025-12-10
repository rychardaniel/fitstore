namespace Fitstore.API.Dtos;

public class ProductDto
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public long? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public long? BrandId { get; set; }
    public string? BrandName { get; set; }
    public bool Active { get; set; }
    public string? Image { get; set; }
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public int StockQuantity { get; set; }
    public string? Sku { get; set; }
}

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public long? CategoryId { get; set; }
    public long? BrandId { get; set; }
    public string? Image { get; set; }
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public int StockQuantity { get; set; }
    public string? Sku { get; set; }
    public decimal? Weight { get; set; }
}

public class UpdateProductDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public long? CategoryId { get; set; }
    public long? BrandId { get; set; }
    public string? Image { get; set; }
    public decimal? Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public int? StockQuantity { get; set; }
    public string? Sku { get; set; }
    public decimal? Weight { get; set; }
    public bool? Active { get; set; }
}

public class ProductFilterDto
{
    public string? Search { get; set; }
    public long? CategoryId { get; set; }
    public long? BrandId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? InStock { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; }
}
