using Fitstore.API.Dtos;
using Fitstore.API.Models;
using Fitstore.API.Repositories;

namespace Fitstore.API.Services;

public class OrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly ICartRepository _cartRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUserRepository _userRepository;

    public OrderService(
        IOrderRepository orderRepository,
        ICartRepository cartRepository,
        IProductRepository productRepository,
        IUserRepository userRepository)
    {
        _orderRepository = orderRepository;
        _cartRepository = cartRepository;
        _productRepository = productRepository;
        _userRepository = userRepository;
    }

    public async Task<OrderDto> CreateOrderAsync(long userId, CreateOrderDto dto)
    {
        var cart = await _cartRepository.GetByUserIdWithItemsAsync(userId);
        if (cart == null || !cart.Items.Any())
            throw new InvalidOperationException("Cart is empty");

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        // Validate stock and calculate total
        decimal totalAmount = 0;
        foreach (var cartItem in cart.Items)
        {
            var product = await _productRepository.GetByIdAsync(cartItem.ProductId);
            if (product == null)
                throw new InvalidOperationException($"Product {cartItem.ProductId} not found");
            
            if (product.StockQuantity < cartItem.Quantity)
                throw new InvalidOperationException($"Insufficient stock for {product.Name}");

            totalAmount += product.Price * cartItem.Quantity;
        }

        // Create order
        var order = new Order
        {
            Uuid = Guid.NewGuid(),
            UserId = userId,
            CreatedAt = DateOnly.FromDateTime(DateTime.Now),
            OrderDate = DateOnly.FromDateTime(DateTime.Now),
            TotalAmount = totalAmount,
            Status = OrderStatus.Open,
            Items = new List<OrderItem>()
        };

        // Create order items and update stock
        foreach (var cartItem in cart.Items)
        {
            var product = await _productRepository.GetByIdAsync(cartItem.ProductId);
            if (product == null) continue;

            var orderItem = new OrderItem
            {
                ProductId = cartItem.ProductId,
                UnitPrice = product.Price,
                Quantity = cartItem.Quantity
            };
            order.Items.Add(orderItem);

            // Reduce stock
            product.StockQuantity -= cartItem.Quantity;
            product.UpdatedAt = DateTime.UtcNow;
            _productRepository.Update(product);
        }

        await _orderRepository.AddAsync(order);

        // Clear cart
        foreach (var item in cart.Items.ToList())
        {
            _cartRepository.RemoveItem(item);
        }

        await _orderRepository.SaveChangesAsync();

        return await GetOrderByIdAsync(order.Id) ?? throw new InvalidOperationException("Order creation failed");
    }

    public async Task<IEnumerable<OrderSummaryDto>> GetUserOrdersAsync(long userId)
    {
        var orders = await _orderRepository.GetByUserIdAsync(userId);
        return orders.Select(o => new OrderSummaryDto
        {
            Id = o.Id,
            Uuid = o.Uuid,
            OrderDate = o.OrderDate,
            TotalAmount = o.TotalAmount,
            Status = o.Status.ToString(),
            ItemCount = o.Items.Count
        });
    }

    public async Task<OrderDto?> GetOrderByIdAsync(long id)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(id);
        return order != null ? MapToDto(order) : null;
    }

    public async Task<OrderDto?> GetOrderByUuidAsync(Guid uuid)
    {
        var order = await _orderRepository.GetByUuidAsync(uuid);
        return order != null ? MapToDto(order) : null;
    }

    public async Task<OrderDto?> UpdateStatusAsync(long id, OrderStatus newStatus)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(id);
        if (order == null) return null;

        order.Status = newStatus;
        
        if (newStatus == OrderStatus.Delivered)
        {
            order.DeliveryDate = DateOnly.FromDateTime(DateTime.Now);
        }

        _orderRepository.Update(order);
        await _orderRepository.SaveChangesAsync();

        return MapToDto(order);
    }

    public async Task<bool> CancelOrderAsync(long id, long userId)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(id);
        if (order == null || order.UserId != userId)
            return false;

        if (order.Status != OrderStatus.Open && order.Status != OrderStatus.Confirmed)
            throw new InvalidOperationException("Order cannot be canceled");

        // Restore stock
        foreach (var item in order.Items)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId ?? 0);
            if (product != null)
            {
                product.StockQuantity += (int)item.Quantity;
                product.UpdatedAt = DateTime.UtcNow;
                _productRepository.Update(product);
            }
        }

        order.Status = OrderStatus.Canceled;
        _orderRepository.Update(order);
        await _orderRepository.SaveChangesAsync();

        return true;
    }

    private static OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            Uuid = order.Uuid,
            CreatedAt = order.CreatedAt,
            OrderDate = order.OrderDate,
            DeliveryDate = order.DeliveryDate,
            TotalAmount = order.TotalAmount,
            Status = order.Status.ToString(),
            Items = order.Items.Select(i => new OrderItemDto
            {
                Id = i.Id,
                ProductId = i.ProductId ?? 0,
                ProductName = i.Product?.Name,
                ProductImage = i.Product?.Image,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity,
                Total = i.UnitPrice * i.Quantity
            }).ToList(),
            ShippingAddress = order.User != null ? new ShippingAddressDto
            {
                Address = order.User.Address,
                City = order.User.City,
                State = order.User.State,
                ZipCode = order.User.ZipCode
            } : null
        };
    }
}
