using Fitstore.API.Models;

namespace Fitstore.API.Repositories;

public interface ICartRepository : IRepository<Cart>
{
    Task<Cart?> GetByUserIdAsync(long userId);
    Task<Cart?> GetByUserIdWithItemsAsync(long userId);
    Task<CartItem?> GetCartItemAsync(long cartId, long productId);
    Task AddItemAsync(CartItem item);
    void RemoveItem(CartItem item);
    Task<CartItem?> GetCartItemByIdAsync(long itemId);
}
