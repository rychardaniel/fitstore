using Fitstore.API.Data;
using Fitstore.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitstore.API.Repositories;

public class CartRepository : Repository<Cart>, ICartRepository
{
    public CartRepository(AppDbContext context) : base(context) { }

    public async Task<Cart?> GetByUserIdAsync(long userId)
    {
        return await _dbSet.FirstOrDefaultAsync(c => c.UserId == userId);
    }

    public async Task<Cart?> GetByUserIdWithItemsAsync(long userId)
    {
        return await _dbSet
            .Include(c => c.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);
    }

    public async Task<CartItem?> GetCartItemAsync(long cartId, long productId)
    {
        return await _context.Set<CartItem>()
            .FirstOrDefaultAsync(i => i.CartId == cartId && i.ProductId == productId);
    }

    public async Task AddItemAsync(CartItem item)
    {
        await _context.Set<CartItem>().AddAsync(item);
    }

    public void RemoveItem(CartItem item)
    {
        _context.Set<CartItem>().Remove(item);
    }

    public async Task<CartItem?> GetCartItemByIdAsync(long itemId)
    {
        return await _context.Set<CartItem>()
            .Include(i => i.Product)
            .Include(i => i.Cart)
            .FirstOrDefaultAsync(i => i.Id == itemId);
    }
}
