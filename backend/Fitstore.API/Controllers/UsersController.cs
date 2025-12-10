using Fitstore.API.Dtos;
using Fitstore.API.Models;
using Fitstore.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fitstore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserService _service;

    public UsersController(UserService service)
    {
        _service = service;
    }

    [HttpGet]
    // [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _service.GetAllAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    // [Authorize]
    public async Task<IActionResult> GetDetails(long id)
    {
        var user = await _service.GetDetailsAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create(RegisterUserDto dto)
    {
        var newUser = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetDetails), new { id = newUser.Id }, newUser);
    }

    [HttpPut]
    // [Authorize]
    public async Task<IActionResult> Update(User user)
    {
        var updatedUser = await _service.UpdateUserAsync(user);
        return Ok(updatedUser);
    }

    [HttpDelete("{id}")]
    // [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Deactivate(long id)
    {
        await _service.DeactivateAsync(id);
        return NoContent();
    }

    [HttpPost("authenticate")]
    public async Task<IActionResult> Authenticate(LoginDto login)
    {
        var token = await _service.AuthenticateAsync(login);
        if (token == null) return NotFound(); // Or Unauthorized

        Response.Cookies.Append("jwt", token, new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Lax,
            MaxAge = TimeSpan.FromHours(1),
            Path = "/"
        });

        return Ok(new { token, message = "Logged" });
    }
}
