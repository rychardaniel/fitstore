using Fitstore.API.Data;
using Fitstore.API.Dtos;
using Fitstore.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitstore.API.Services;

public class AdminService
{
    private readonly AppDbContext _context;

    public AdminService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AdminStatsDto> GetDashboardStatsAsync()
    {
        var stats = new AdminStatsDto
        {
            TotalRevenue = await _context.Orders.SumAsync(o => o.TotalAmount),
            TotalOrders = await _context.Orders.CountAsync(),
            TotalProducts = await _context.Products.CountAsync(),
            TotalUsers = await _context.Users.CountAsync(),
            PendingOrders = await _context.Orders.CountAsync(o => o.Status == OrderStatus.Open),
            LowStockProducts = await _context.Products.CountAsync(p => p.StockQuantity < 10),
            RecentOrders = await GetRecentOrdersAsync(5),
            TopProducts = await GetTopProductsAsync(5)
        };

        return stats;
    }

    private async Task<List<RecentOrderDto>> GetRecentOrdersAsync(int count)
    {
        return await _context.Orders
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .Take(count)
            .Select(o => new RecentOrderDto
            {
                Id = o.Id,
                CustomerName = o.User != null ? o.User.FullName : null,
                CustomerEmail = o.User != null ? o.User.Email : null,
                Total = o.TotalAmount,
                Status = o.Status.ToString(),
                CreatedAt = o.CreatedAt.ToDateTime(TimeOnly.MinValue)
            })
            .ToListAsync();
    }

    private async Task<List<TopProductDto>> GetTopProductsAsync(int count)
    {
        return await _context.OrderItems
            .Include(oi => oi.Product)
            .GroupBy(oi => new { oi.ProductId, oi.Product!.Name, oi.Product.Image })
            .Select(g => new TopProductDto
            {
                Id = g.Key.ProductId ?? 0,
                Name = g.Key.Name,
                Image = g.Key.Image,
                TotalSold = (int)g.Sum(oi => oi.Quantity),
                Revenue = g.Sum(oi => oi.UnitPrice * oi.Quantity)
            })
            .OrderByDescending(p => p.TotalSold)
            .Take(count)
            .ToListAsync();
    }

    public async Task<PaginatedResponse<RecentOrderDto>> GetAllOrdersAsync(AdminOrderFilterDto filter)
    {
        var query = _context.Orders
            .Include(o => o.User)
            .AsQueryable();

        if (!string.IsNullOrEmpty(filter.Status) && Enum.TryParse<OrderStatus>(filter.Status, out var status))
        {
            query = query.Where(o => o.Status == status);
        }

        if (!string.IsNullOrEmpty(filter.Search))
        {
            query = query.Where(o =>
                (o.User != null && o.User.FullName != null && o.User.FullName.Contains(filter.Search)) ||
                (o.User != null && o.User.Email != null && o.User.Email.Contains(filter.Search)));
        }

        if (filter.StartDate.HasValue)
        {
            var startDate = DateOnly.FromDateTime(filter.StartDate.Value);
            query = query.Where(o => o.CreatedAt >= startDate);
        }

        if (filter.EndDate.HasValue)
        {
            var endDate = DateOnly.FromDateTime(filter.EndDate.Value);
            query = query.Where(o => o.CreatedAt <= endDate);
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)filter.PageSize);

        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(o => new RecentOrderDto
            {
                Id = o.Id,
                CustomerName = o.User != null ? o.User.FullName : null,
                CustomerEmail = o.User != null ? o.User.Email : null,
                Total = o.TotalAmount,
                Status = o.Status.ToString(),
                CreatedAt = o.CreatedAt.ToDateTime(TimeOnly.MinValue)
            })
            .ToListAsync();

        return new PaginatedResponse<RecentOrderDto>
        {
            Data = orders,
            Page = filter.Page,
            PageSize = filter.PageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        };
    }

    public async Task<bool> UpdateOrderStatusAsync(long orderId, string statusStr)
    {
        if (!Enum.TryParse<OrderStatus>(statusStr, out var status))
            return false;

        var order = await _context.Orders.FindAsync(orderId);
        if (order == null)
            return false;

        order.Status = status;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<PaginatedResponse<AdminUserDto>> GetAllUsersAsync(int page, int pageSize, string? search)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(u =>
                (u.FullName != null && u.FullName.Contains(search)) ||
                (u.Email != null && u.Email.Contains(search)));
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new AdminUserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Phone = u.Phone,
                Role = u.Role,
                Active = u.Active,
                CreatedAt = u.CreatedAt,
                OrderCount = u.Orders.Count,
                TotalSpent = u.Orders.Sum(o => o.TotalAmount)
            })
            .ToListAsync();

        return new PaginatedResponse<AdminUserDto>
        {
            Data = users,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        };
    }

    public async Task<bool> UpdateUserRoleAsync(long userId, string role)
    {
        var validRoles = new[] { "Client", "Admin" };
        if (!validRoles.Contains(role))
            return false;

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return false;

        user.Role = role;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleUserActiveAsync(long userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return false;

        user.Active = !user.Active;
        await _context.SaveChangesAsync();
        return true;
    }
}
