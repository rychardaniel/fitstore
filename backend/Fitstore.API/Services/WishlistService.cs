using Fitstore.API.Dtos;
using Fitstore.API.Models;
using Fitstore.API.Repositories;

namespace Fitstore.API.Services;

public class WishlistService
{
    private readonly IWishlistRepository _wishlistRepository;
    private readonly IProductRepository _productRepository;

    public WishlistService(IWishlistRepository wishlistRepository, IProductRepository productRepository)
    {
        _wishlistRepository = wishlistRepository;
        _productRepository = productRepository;
    }

    public async Task<WishlistDto> GetWishlistAsync(long userId)
    {
        var wishlist = await _wishlistRepository.GetByUserIdAsync(userId);

        if (wishlist == null)
        {
            return new WishlistDto
            {
                Id = 0,
                TotalItems = 0,
                Items = new List<WishlistItemDto>()
            };
        }

        return MapToDto(wishlist);
    }

    public async Task<WishlistDto> AddToWishlistAsync(long userId, long productId)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null)
            throw new InvalidOperationException("Product not found");

        var wishlist = await _wishlistRepository.GetByUserIdAsync(userId);

        if (wishlist == null)
        {
            wishlist = await _wishlistRepository.CreateAsync(userId);
        }

        // Check if already in wishlist
        var existingItem = await _wishlistRepository.GetItemAsync(wishlist.Id, productId);
        if (existingItem != null)
            throw new InvalidOperationException("Product already in wishlist");

        var item = new WishlistItem
        {
            WishlistId = wishlist.Id,
            ProductId = productId,
            AddedAt = DateTime.UtcNow
        };

        await _wishlistRepository.AddItemAsync(item);

        // Reload wishlist with items
        wishlist = await _wishlistRepository.GetByUserIdAsync(userId);
        return MapToDto(wishlist!);
    }

    public async Task<WishlistDto> RemoveFromWishlistAsync(long userId, long productId)
    {
        var wishlist = await _wishlistRepository.GetByUserIdAsync(userId);
        if (wishlist == null)
            throw new InvalidOperationException("Wishlist not found");

        var item = await _wishlistRepository.GetItemAsync(wishlist.Id, productId);
        if (item == null)
            throw new InvalidOperationException("Product not in wishlist");

        await _wishlistRepository.RemoveItemAsync(item);

        // Reload wishlist
        wishlist = await _wishlistRepository.GetByUserIdAsync(userId);
        return MapToDto(wishlist!);
    }

    public async Task ClearWishlistAsync(long userId)
    {
        var wishlist = await _wishlistRepository.GetByUserIdAsync(userId);
        if (wishlist != null)
        {
            await _wishlistRepository.ClearAsync(wishlist);
        }
    }

    public async Task<bool> IsInWishlistAsync(long userId, long productId)
    {
        return await _wishlistRepository.IsProductInWishlistAsync(userId, productId);
    }

    private static WishlistDto MapToDto(Wishlist wishlist)
    {
        return new WishlistDto
        {
            Id = wishlist.Id,
            TotalItems = wishlist.Items.Count,
            Items = wishlist.Items.Select(i => new WishlistItemDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.Product?.Name,
                ProductImage = i.Product?.Image,
                Price = i.Product?.Price ?? 0,
                OriginalPrice = i.Product?.OriginalPrice,
                InStock = (i.Product?.StockQuantity ?? 0) > 0,
                AddedAt = i.AddedAt
            }).ToList()
        };
    }
}
