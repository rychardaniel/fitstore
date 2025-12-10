using Fitstore.API.Data;
using Fitstore.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitstore.API.Repositories;

public class BrandRepository : Repository<Brand>, IBrandRepository
{
    public BrandRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Brand>> GetAllWithProductCountAsync()
    {
        return await _dbSet.ToListAsync();
    }
}
