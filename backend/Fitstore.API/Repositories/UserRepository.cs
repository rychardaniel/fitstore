using Fitstore.API.Data;
using Fitstore.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitstore.API.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<User?> FindByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }
}
