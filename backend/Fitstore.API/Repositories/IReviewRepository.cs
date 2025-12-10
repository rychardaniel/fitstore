using Fitstore.API.Models;

namespace Fitstore.API.Repositories;

public interface IReviewRepository
{
    Task<List<Review>> GetByProductIdAsync(long productId);
    Task<List<Review>> GetByUserIdAsync(long userId);
    Task<Review?> GetByIdAsync(long id);
    Task<Review?> GetUserReviewForProductAsync(long userId, long productId);
    Task<Review> AddAsync(Review review);
    Task<Review> UpdateAsync(Review review);
    Task DeleteAsync(Review review);
    Task<double> GetAverageRatingAsync(long productId);
    Task<int> GetReviewCountAsync(long productId);
}
