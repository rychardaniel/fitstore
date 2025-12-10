using System.Security.Claims;
using Fitstore.API.Dtos;
using Fitstore.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fitstore.API.Controllers;

[ApiController]
[Route("api")]
public class ReviewsController : ControllerBase
{
    private readonly ReviewService _reviewService;

    public ReviewsController(ReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet("products/{productId}/reviews")]
    public async Task<ActionResult<ProductReviewsDto>> GetProductReviews(long productId)
    {
        var reviews = await _reviewService.GetProductReviewsAsync(productId);
        return Ok(reviews);
    }

    [HttpPost("products/{productId}/reviews")]
    [Authorize]
    public async Task<ActionResult<ReviewDto>> CreateReview(long productId, [FromBody] CreateReviewDto dto)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        try
        {
            var review = await _reviewService.CreateReviewAsync(productId, userId.Value, dto);
            return CreatedAtAction(nameof(GetReview), new { id = review.Id }, review);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("reviews/{id}")]
    public async Task<ActionResult<ReviewDto>> GetReview(long id)
    {
        var review = await _reviewService.GetReviewByIdAsync(id);
        if (review == null)
            return NotFound();
        return Ok(review);
    }

    [HttpPut("reviews/{id}")]
    [Authorize]
    public async Task<ActionResult<ReviewDto>> UpdateReview(long id, [FromBody] UpdateReviewDto dto)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        try
        {
            var review = await _reviewService.UpdateReviewAsync(id, userId.Value, dto);
            return Ok(review);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpDelete("reviews/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteReview(long id)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        try
        {
            await _reviewService.DeleteReviewAsync(id, userId.Value);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    private long? GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (long.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }
}
