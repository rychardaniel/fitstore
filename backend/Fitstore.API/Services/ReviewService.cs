using Fitstore.API.Dtos;
using Fitstore.API.Models;
using Fitstore.API.Repositories;

namespace Fitstore.API.Services;

public class ReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IProductRepository _productRepository;

    public ReviewService(IReviewRepository reviewRepository, IProductRepository productRepository)
    {
        _reviewRepository = reviewRepository;
        _productRepository = productRepository;
    }

    public async Task<ProductReviewsDto> GetProductReviewsAsync(long productId)
    {
        var reviews = await _reviewRepository.GetByProductIdAsync(productId);

        var ratingDistribution = reviews
            .GroupBy(r => r.Rating)
            .ToDictionary(g => g.Key, g => g.Count());

        // Ensure all ratings 1-5 are present
        for (int i = 1; i <= 5; i++)
        {
            if (!ratingDistribution.ContainsKey(i))
                ratingDistribution[i] = 0;
        }

        return new ProductReviewsDto
        {
            ProductId = productId,
            AverageRating = reviews.Count > 0 ? reviews.Average(r => r.Rating) : 0,
            TotalReviews = reviews.Count,
            RatingDistribution = ratingDistribution,
            Reviews = reviews.Select(MapToDto).ToList()
        };
    }

    public async Task<ReviewDto?> GetReviewByIdAsync(long id)
    {
        var review = await _reviewRepository.GetByIdAsync(id);
        return review != null ? MapToDto(review) : null;
    }

    public async Task<ReviewDto> CreateReviewAsync(long productId, long userId, CreateReviewDto dto)
    {
        // Check if product exists
        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null)
            throw new InvalidOperationException("Product not found");

        // Check if user already reviewed this product
        var existingReview = await _reviewRepository.GetUserReviewForProductAsync(userId, productId);
        if (existingReview != null)
            throw new InvalidOperationException("You have already reviewed this product");

        // Validate rating
        if (dto.Rating < 1 || dto.Rating > 5)
            throw new InvalidOperationException("Rating must be between 1 and 5");

        var review = new Review
        {
            ProductId = productId,
            UserId = userId,
            Rating = dto.Rating,
            Title = dto.Title,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _reviewRepository.AddAsync(review);

        // Reload with user navigation
        var savedReview = await _reviewRepository.GetByIdAsync(review.Id);
        return MapToDto(savedReview!);
    }

    public async Task<ReviewDto> UpdateReviewAsync(long id, long userId, UpdateReviewDto dto)
    {
        var review = await _reviewRepository.GetByIdAsync(id);
        if (review == null)
            throw new InvalidOperationException("Review not found");

        if (review.UserId != userId)
            throw new UnauthorizedAccessException("You can only edit your own reviews");

        if (dto.Rating < 1 || dto.Rating > 5)
            throw new InvalidOperationException("Rating must be between 1 and 5");

        review.Rating = dto.Rating;
        review.Title = dto.Title;
        review.Comment = dto.Comment;

        await _reviewRepository.UpdateAsync(review);
        return MapToDto(review);
    }

    public async Task DeleteReviewAsync(long id, long userId)
    {
        var review = await _reviewRepository.GetByIdAsync(id);
        if (review == null)
            throw new InvalidOperationException("Review not found");

        if (review.UserId != userId)
            throw new UnauthorizedAccessException("You can only delete your own reviews");

        await _reviewRepository.DeleteAsync(review);
    }

    private static ReviewDto MapToDto(Review review)
    {
        return new ReviewDto
        {
            Id = review.Id,
            ProductId = review.ProductId,
            UserId = review.UserId,
            UserName = review.User?.FullName ?? "Anonymous",
            Rating = review.Rating,
            Title = review.Title,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt,
            UpdatedAt = review.UpdatedAt
        };
    }
}
