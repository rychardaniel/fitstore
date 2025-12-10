using Fitstore.API.Models;

namespace Fitstore.API.Repositories;

public interface IOrderRepository : IRepository<Order>
{
    Task<IEnumerable<Order>> GetByUserIdAsync(long userId);
    Task<Order?> GetByIdWithDetailsAsync(long id);
    Task<Order?> GetByUuidAsync(Guid uuid);
    Task<IEnumerable<Order>> GetByStatusAsync(OrderStatus status);
    Task<IEnumerable<Order>> GetRecentOrdersAsync(int count);
}
