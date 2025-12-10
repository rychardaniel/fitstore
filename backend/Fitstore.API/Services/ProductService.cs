using Fitstore.API.Dtos;
using Fitstore.API.Models;
using Fitstore.API.Repositories;

namespace Fitstore.API.Services;

public class ProductService
{
    private readonly IProductRepository _repository;

    public ProductService(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<PaginatedResponse<ProductDto>> GetFilteredAsync(ProductFilterDto filter)
    {
        var (products, totalCount) = await _repository.GetFilteredAsync(filter);
        
        var productDtos = products.Select(MapToDto);
        
        return new PaginatedResponse<ProductDto>
        {
            Data = productDtos,
            Page = filter.Page,
            PageSize = filter.PageSize,
            TotalItems = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize)
        };
    }

    public async Task<ProductDto?> GetByIdAsync(long id)
    {
        var product = await _repository.GetByIdWithDetailsAsync(id);
        return product != null ? MapToDto(product) : null;
    }

    public async Task<IEnumerable<ProductDto>> GetByCategoryAsync(long categoryId)
    {
        var products = await _repository.GetByCategoryAsync(categoryId);
        return products.Select(MapToDto);
    }

    public async Task<IEnumerable<ProductDto>> GetByBrandAsync(long brandId)
    {
        var products = await _repository.GetByBrandAsync(brandId);
        return products.Select(MapToDto);
    }

    public async Task<IEnumerable<ProductDto>> SearchAsync(string searchTerm)
    {
        var products = await _repository.SearchAsync(searchTerm);
        return products.Select(MapToDto);
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            CategoryId = dto.CategoryId,
            BrandId = dto.BrandId,
            Image = dto.Image,
            Price = dto.Price,
            OriginalPrice = dto.OriginalPrice,
            StockQuantity = dto.StockQuantity,
            Sku = dto.Sku,
            Weight = dto.Weight,
            Active = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(product);
        await _repository.SaveChangesAsync();

        return MapToDto(product);
    }

    public async Task<ProductDto?> UpdateAsync(long id, UpdateProductDto dto)
    {
        var product = await _repository.GetByIdAsync(id);
        if (product == null) return null;

        if (dto.Name != null) product.Name = dto.Name;
        if (dto.Description != null) product.Description = dto.Description;
        if (dto.CategoryId.HasValue) product.CategoryId = dto.CategoryId;
        if (dto.BrandId.HasValue) product.BrandId = dto.BrandId;
        if (dto.Image != null) product.Image = dto.Image;
        if (dto.Price.HasValue) product.Price = dto.Price.Value;
        if (dto.OriginalPrice.HasValue) product.OriginalPrice = dto.OriginalPrice;
        if (dto.StockQuantity.HasValue) product.StockQuantity = dto.StockQuantity.Value;
        if (dto.Sku != null) product.Sku = dto.Sku;
        if (dto.Weight.HasValue) product.Weight = dto.Weight;
        if (dto.Active.HasValue) product.Active = dto.Active.Value;
        
        product.UpdatedAt = DateTime.UtcNow;

        _repository.Update(product);
        await _repository.SaveChangesAsync();

        return MapToDto(product);
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var product = await _repository.GetByIdAsync(id);
        if (product == null) return false;

        product.Active = false;
        product.UpdatedAt = DateTime.UtcNow;
        
        _repository.Update(product);
        await _repository.SaveChangesAsync();
        
        return true;
    }

    public async Task<bool> UpdateStockAsync(long id, int quantity)
    {
        var product = await _repository.GetByIdAsync(id);
        if (product == null) return false;

        product.StockQuantity = quantity;
        product.UpdatedAt = DateTime.UtcNow;
        
        _repository.Update(product);
        await _repository.SaveChangesAsync();
        
        return true;
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name,
            BrandId = product.BrandId,
            BrandName = product.Brand?.Name,
            Active = product.Active,
            Image = product.Image,
            Price = product.Price,
            OriginalPrice = product.OriginalPrice,
            StockQuantity = product.StockQuantity,
            Sku = product.Sku
        };
    }
}
