using Fitstore.API.Models;

namespace Fitstore.API.Repositories;

public interface IBrandRepository : IRepository<Brand>
{
    Task<IEnumerable<Brand>> GetAllWithProductCountAsync();
}
