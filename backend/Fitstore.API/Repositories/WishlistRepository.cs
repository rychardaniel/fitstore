using Fitstore.API.Data;
using Fitstore.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitstore.API.Repositories;

public class WishlistRepository : IWishlistRepository
{
    private readonly AppDbContext _context;

    public WishlistRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Wishlist?> GetByUserIdAsync(long userId)
    {
        return await _context.Wishlists
            .Include(w => w.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(w => w.UserId == userId);
    }

    public async Task<Wishlist> CreateAsync(long userId)
    {
        var wishlist = new Wishlist
        {
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };
        _context.Wishlists.Add(wishlist);
        await _context.SaveChangesAsync();
        return wishlist;
    }

    public async Task<WishlistItem?> GetItemAsync(long wishlistId, long productId)
    {
        return await _context.WishlistItems
            .FirstOrDefaultAsync(i => i.WishlistId == wishlistId && i.ProductId == productId);
    }

    public async Task<WishlistItem> AddItemAsync(WishlistItem item)
    {
        _context.WishlistItems.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task RemoveItemAsync(WishlistItem item)
    {
        _context.WishlistItems.Remove(item);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> IsProductInWishlistAsync(long userId, long productId)
    {
        return await _context.Wishlists
            .Where(w => w.UserId == userId)
            .SelectMany(w => w.Items)
            .AnyAsync(i => i.ProductId == productId);
    }

    public async Task ClearAsync(Wishlist wishlist)
    {
        _context.WishlistItems.RemoveRange(wishlist.Items);
        await _context.SaveChangesAsync();
    }
}
