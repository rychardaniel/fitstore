using Fitstore.API.Dtos;
using Fitstore.API.Models;
using Fitstore.API.Repositories;

namespace Fitstore.API.Services;

public class CartService
{
    private readonly ICartRepository _cartRepository;
    private readonly IProductRepository _productRepository;

    public CartService(ICartRepository cartRepository, IProductRepository productRepository)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
    }

    public async Task<CartDto> GetCartAsync(long userId)
    {
        var cart = await _cartRepository.GetByUserIdWithItemsAsync(userId);
        
        if (cart == null)
        {
            return new CartDto { Items = new List<CartItemDto>() };
        }

        return MapToDto(cart);
    }

    public async Task<CartDto> AddItemAsync(long userId, AddToCartDto dto)
    {
        var product = await _productRepository.GetByIdAsync(dto.ProductId);
        if (product == null)
            throw new InvalidOperationException("Product not found");

        if (product.StockQuantity < dto.Quantity)
            throw new InvalidOperationException("Insufficient stock");

        var cart = await _cartRepository.GetByUserIdWithItemsAsync(userId);
        
        if (cart == null)
        {
            cart = new Cart
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _cartRepository.AddAsync(cart);
            await _cartRepository.SaveChangesAsync();
        }

        var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == dto.ProductId);
        
        if (existingItem != null)
        {
            var newQuantity = existingItem.Quantity + dto.Quantity;
            if (newQuantity > product.StockQuantity)
                throw new InvalidOperationException("Insufficient stock");
            
            existingItem.Quantity = newQuantity;
        }
        else
        {
            var newItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                AddedAt = DateTime.UtcNow
            };
            await _cartRepository.AddItemAsync(newItem);
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _cartRepository.SaveChangesAsync();

        return await GetCartAsync(userId);
    }

    public async Task<CartDto> UpdateItemQuantityAsync(long userId, long itemId, int quantity)
    {
        var cart = await _cartRepository.GetByUserIdWithItemsAsync(userId);
        if (cart == null)
            throw new InvalidOperationException("Cart not found");

        var item = cart.Items.FirstOrDefault(i => i.Id == itemId);
        if (item == null)
            throw new InvalidOperationException("Item not found in cart");

        if (quantity <= 0)
        {
            _cartRepository.RemoveItem(item);
        }
        else
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId);
            if (product != null && quantity > product.StockQuantity)
                throw new InvalidOperationException("Insufficient stock");
            
            item.Quantity = quantity;
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _cartRepository.SaveChangesAsync();

        return await GetCartAsync(userId);
    }

    public async Task<CartDto> RemoveItemAsync(long userId, long itemId)
    {
        var cart = await _cartRepository.GetByUserIdWithItemsAsync(userId);
        if (cart == null)
            throw new InvalidOperationException("Cart not found");

        var item = cart.Items.FirstOrDefault(i => i.Id == itemId);
        if (item == null)
            throw new InvalidOperationException("Item not found in cart");

        _cartRepository.RemoveItem(item);
        cart.UpdatedAt = DateTime.UtcNow;
        await _cartRepository.SaveChangesAsync();

        return await GetCartAsync(userId);
    }

    public async Task ClearCartAsync(long userId)
    {
        var cart = await _cartRepository.GetByUserIdWithItemsAsync(userId);
        if (cart == null) return;

        foreach (var item in cart.Items.ToList())
        {
            _cartRepository.RemoveItem(item);
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _cartRepository.SaveChangesAsync();
    }

    private static CartDto MapToDto(Cart cart)
    {
        var items = cart.Items.Select(i => new CartItemDto
        {
            Id = i.Id,
            ProductId = i.ProductId,
            ProductName = i.Product?.Name,
            ProductImage = i.Product?.Image,
            UnitPrice = i.Product?.Price ?? 0,
            Quantity = i.Quantity,
            Total = (i.Product?.Price ?? 0) * i.Quantity,
            StockAvailable = i.Product?.StockQuantity ?? 0
        }).ToList();

        return new CartDto
        {
            Id = cart.Id,
            Items = items,
            Subtotal = items.Sum(i => i.Total),
            TotalItems = items.Sum(i => i.Quantity)
        };
    }
}
