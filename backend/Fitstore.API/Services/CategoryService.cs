using Fitstore.API.Dtos;
using Fitstore.API.Models;
using Fitstore.API.Repositories;

namespace Fitstore.API.Services;

public class CategoryService
{
    private readonly ICategoryRepository _repository;

    public CategoryService(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories = await _repository.GetAllAsync();
        return categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            ProductCount = 0 // Will be calculated if needed
        });
    }

    public async Task<CategoryDto?> GetByIdAsync(long id)
    {
        var category = await _repository.GetByIdAsync(id);
        return category != null ? new CategoryDto
        {
            Id = category.Id,
            Name = category.Name
        } : null;
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
    {
        var category = new Category { Name = dto.Name };
        await _repository.AddAsync(category);
        await _repository.SaveChangesAsync();

        return new CategoryDto { Id = category.Id, Name = category.Name };
    }

    public async Task<CategoryDto?> UpdateAsync(long id, UpdateCategoryDto dto)
    {
        var category = await _repository.GetByIdAsync(id);
        if (category == null) return null;

        if (dto.Name != null) category.Name = dto.Name;
        
        _repository.Update(category);
        await _repository.SaveChangesAsync();

        return new CategoryDto { Id = category.Id, Name = category.Name };
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var category = await _repository.GetByIdAsync(id);
        if (category == null) return false;

        _repository.Delete(category);
        await _repository.SaveChangesAsync();
        return true;
    }
}
