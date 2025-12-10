using Fitstore.API.Dtos;
using Fitstore.API.Repositories;
using Isopoh.Cryptography.Argon2;

namespace Fitstore.API.Services;

public class ProfileService
{
    private readonly IUserRepository _userRepository;

    public ProfileService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserProfileDto?> GetProfileAsync(long userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            return null;

        return new UserProfileDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            City = user.City,
            State = user.State,
            ZipCode = user.ZipCode,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<UserProfileDto> UpdateProfileAsync(long userId, UpdateProfileDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        user.FullName = dto.FullName ?? user.FullName;
        user.Phone = dto.Phone ?? user.Phone;
        user.Address = dto.Address ?? user.Address;
        user.City = dto.City ?? user.City;
        user.State = dto.State ?? user.State;
        user.ZipCode = dto.ZipCode ?? user.ZipCode;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();

        return new UserProfileDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            City = user.City,
            State = user.State,
            ZipCode = user.ZipCode,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task ChangePasswordAsync(long userId, ChangePasswordDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        // Verify current password
        if (!Argon2.Verify(user.Password, dto.CurrentPassword))
            throw new InvalidOperationException("Current password is incorrect");

        // Hash and set new password
        user.Password = Argon2.Hash(dto.NewPassword);
        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();
    }
}
