using Fitstore.API.Models;

namespace Fitstore.API.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User?> FindByEmailAsync(string email);
}
