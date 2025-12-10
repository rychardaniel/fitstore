using System.Security.Claims;
using Fitstore.API.Dtos;
using Fitstore.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fitstore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly OrderService _service;

    public OrdersController(OrderService service)
    {
        _service = service;
    }

    private long GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (long.TryParse(userIdClaim, out var userId))
            return userId;
        throw new UnauthorizedAccessException("User not authenticated");
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
    {
        try
        {
            var userId = GetUserId();
            var order = await _service.CreateOrderAsync(userId, dto);
            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetUserOrders()
    {
        try
        {
            var userId = GetUserId();
            var orders = await _service.GetUserOrdersAsync(userId);
            return Ok(orders);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        var order = await _service.GetOrderByIdAsync(id);
        if (order == null) return NotFound();
        
        // Check if user owns this order (unless admin)
        try
        {
            var userId = GetUserId();
            var isAdmin = User.IsInRole("Admin");
            
            // If not admin, verify ownership through UUID lookup
            if (!isAdmin)
            {
                var userOrders = await _service.GetUserOrdersAsync(userId);
                if (!userOrders.Any(o => o.Id == id))
                    return Forbid();
            }
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
        
        return Ok(order);
    }

    [HttpGet("uuid/{uuid}")]
    public async Task<IActionResult> GetByUuid(Guid uuid)
    {
        var order = await _service.GetOrderByUuidAsync(uuid);
        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(long id, UpdateOrderStatusDto dto)
    {
        var order = await _service.UpdateStatusAsync(id, dto.Status);
        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> CancelOrder(long id)
    {
        try
        {
            var userId = GetUserId();
            var success = await _service.CancelOrderAsync(id, userId);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
