using System.Security.Claims;
using Fitstore.API.Dtos;
using Fitstore.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fitstore.API.Controllers;

[ApiController]
[Route("api/wishlist")]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly WishlistService _wishlistService;

    public WishlistController(WishlistService wishlistService)
    {
        _wishlistService = wishlistService;
    }

    [HttpGet]
    public async Task<ActionResult<WishlistDto>> GetWishlist()
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        var wishlist = await _wishlistService.GetWishlistAsync(userId.Value);
        return Ok(wishlist);
    }

    [HttpPost("{productId}")]
    public async Task<ActionResult<WishlistDto>> AddToWishlist(long productId)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        try
        {
            var wishlist = await _wishlistService.AddToWishlistAsync(userId.Value, productId);
            return Ok(wishlist);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{productId}")]
    public async Task<ActionResult<WishlistDto>> RemoveFromWishlist(long productId)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        try
        {
            var wishlist = await _wishlistService.RemoveFromWishlistAsync(userId.Value, productId);
            return Ok(wishlist);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete]
    public async Task<IActionResult> ClearWishlist()
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        await _wishlistService.ClearWishlistAsync(userId.Value);
        return NoContent();
    }

    [HttpGet("{productId}/check")]
    public async Task<ActionResult<bool>> IsInWishlist(long productId)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        var isInWishlist = await _wishlistService.IsInWishlistAsync(userId.Value, productId);
        return Ok(isInWishlist);
    }

    private long? GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (long.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }
}
