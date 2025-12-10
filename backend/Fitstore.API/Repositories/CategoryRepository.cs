using Fitstore.API.Data;
using Fitstore.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitstore.API.Repositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    public CategoryRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Category>> GetAllWithProductCountAsync()
    {
        return await _dbSet.ToListAsync();
    }
}
