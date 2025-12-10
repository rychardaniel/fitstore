using Fitstore.API.Dtos;
using Fitstore.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fitstore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AdminService _adminService;

    public AdminController(AdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var stats = await _adminService.GetDashboardStatsAsync();
        return Ok(stats);
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders([FromQuery] AdminOrderFilterDto filter)
    {
        var orders = await _adminService.GetAllOrdersAsync(filter);
        return Ok(orders);
    }

    [HttpPatch("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(long id, [FromBody] UpdateOrderStatusDto dto)
    {
        var success = await _adminService.UpdateOrderStatusAsync(id, dto.Status.ToString());
        if (!success)
            return BadRequest("Invalid status or order not found");
        return NoContent();
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null)
    {
        var users = await _adminService.GetAllUsersAsync(page, pageSize, search);
        return Ok(users);
    }

    [HttpPatch("users/{id}/role")]
    public async Task<IActionResult> UpdateUserRole(long id, [FromBody] UpdateUserRoleDto dto)
    {
        var success = await _adminService.UpdateUserRoleAsync(id, dto.Role);
        if (!success)
            return BadRequest("Invalid role or user not found");
        return NoContent();
    }

    [HttpPatch("users/{id}/toggle-active")]
    public async Task<IActionResult> ToggleUserActive(long id)
    {
        var success = await _adminService.ToggleUserActiveAsync(id);
        if (!success)
            return NotFound();
        return NoContent();
    }
}
