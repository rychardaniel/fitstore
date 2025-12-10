using Fitstore.API.Dtos;
using Fitstore.API.Models;

namespace Fitstore.API.Repositories;

public interface IProductRepository : IRepository<Product>
{
    Task<(IEnumerable<Product> Products, int TotalCount)> GetFilteredAsync(ProductFilterDto filter);
    Task<IEnumerable<Product>> GetByCategoryAsync(long categoryId);
    Task<IEnumerable<Product>> GetByBrandAsync(long brandId);
    Task<IEnumerable<Product>> SearchAsync(string searchTerm);
    Task<Product?> GetByIdWithDetailsAsync(long id);
}
