using Fitstore.API.Data;
using Fitstore.API.Dtos;
using Fitstore.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitstore.API.Repositories;

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<(IEnumerable<Product> Products, int TotalCount)> GetFilteredAsync(ProductFilterDto filter)
    {
        var query = _dbSet
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Where(p => p.Active)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var searchLower = filter.Search.ToLower();
            query = query.Where(p =>
                (p.Name != null && p.Name.ToLower().Contains(searchLower)) ||
                (p.Description != null && p.Description.ToLower().Contains(searchLower)));
        }

        if (filter.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == filter.CategoryId);

        if (filter.BrandId.HasValue)
            query = query.Where(p => p.BrandId == filter.BrandId);

        if (filter.MinPrice.HasValue)
            query = query.Where(p => p.Price >= filter.MinPrice.Value);

        if (filter.MaxPrice.HasValue)
            query = query.Where(p => p.Price <= filter.MaxPrice.Value);

        if (filter.InStock == true)
            query = query.Where(p => p.StockQuantity > 0);

        // Get total count before pagination
        var totalCount = await query.CountAsync();
        
        // Apply sorting
        query = filter.SortBy?.ToLower() switch
        {
            "price" => filter.SortDescending ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
            "name" => filter.SortDescending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.Id)
        };

        // Apply pagination
        var products = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return (products, totalCount);
    }

    public async Task<IEnumerable<Product>> GetByCategoryAsync(long categoryId)
    {
        return await _dbSet
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Where(p => p.CategoryId == categoryId && p.Active)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetByBrandAsync(long brandId)
    {
        return await _dbSet
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Where(p => p.BrandId == brandId && p.Active)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> SearchAsync(string searchTerm)
    {
        var searchLower = searchTerm.ToLower();
        return await _dbSet
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Where(p => p.Active &&
                        ((p.Name != null && p.Name.ToLower().Contains(searchLower)) ||
                         (p.Description != null && p.Description.ToLower().Contains(searchLower))))
            .Take(20)
            .ToListAsync();
    }

    public async Task<Product?> GetByIdWithDetailsAsync(long id)
    {
        return await _dbSet
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .FirstOrDefaultAsync(p => p.Id == id);
    }
}