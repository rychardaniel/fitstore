using Fitstore.API.Dtos;
using Fitstore.API.Models;
using Fitstore.API.Repositories;

namespace Fitstore.API.Services;

public class BrandService
{
    private readonly IBrandRepository _repository;

    public BrandService(IBrandRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<BrandDto>> GetAllAsync()
    {
        var brands = await _repository.GetAllAsync();
        return brands.Select(b => new BrandDto
        {
            Id = b.Id,
            Name = b.Name,
            ProductCount = 0
        });
    }

    public async Task<BrandDto?> GetByIdAsync(long id)
    {
        var brand = await _repository.GetByIdAsync(id);
        return brand != null ? new BrandDto
        {
            Id = brand.Id,
            Name = brand.Name
        } : null;
    }

    public async Task<BrandDto> CreateAsync(CreateBrandDto dto)
    {
        var brand = new Brand { Name = dto.Name };
        await _repository.AddAsync(brand);
        await _repository.SaveChangesAsync();

        return new BrandDto { Id = brand.Id, Name = brand.Name };
    }

    public async Task<BrandDto?> UpdateAsync(long id, UpdateBrandDto dto)
    {
        var brand = await _repository.GetByIdAsync(id);
        if (brand == null) return null;

        if (dto.Name != null) brand.Name = dto.Name;
        
        _repository.Update(brand);
        await _repository.SaveChangesAsync();

        return new BrandDto { Id = brand.Id, Name = brand.Name };
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var brand = await _repository.GetByIdAsync(id);
        if (brand == null) return false;

        _repository.Delete(brand);
        await _repository.SaveChangesAsync();
        return true;
    }
}
