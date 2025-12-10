using Fitstore.API.Models;

namespace Fitstore.API.Repositories;

public interface ICategoryRepository : IRepository<Category>
{
    Task<IEnumerable<Category>> GetAllWithProductCountAsync();
}
