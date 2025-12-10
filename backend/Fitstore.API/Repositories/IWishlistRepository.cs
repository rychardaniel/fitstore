using Fitstore.API.Models;

namespace Fitstore.API.Repositories;

public interface IWishlistRepository
{
    Task<Wishlist?> GetByUserIdAsync(long userId);
    Task<Wishlist> CreateAsync(long userId);
    Task<WishlistItem?> GetItemAsync(long wishlistId, long productId);
    Task<WishlistItem> AddItemAsync(WishlistItem item);
    Task RemoveItemAsync(WishlistItem item);
    Task<bool> IsProductInWishlistAsync(long userId, long productId);
    Task ClearAsync(Wishlist wishlist);
}
