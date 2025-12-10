using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Fitstore.API.Dtos;
using Fitstore.API.Models;
using Fitstore.API.Repositories;
using Isopoh.Cryptography.Argon2;
using Microsoft.IdentityModel.Tokens;

namespace Fitstore.API.Services;

public class UserService
{
    private readonly IUserRepository _repository;
    private readonly IConfiguration _configuration;

    public UserService(IUserRepository repository, IConfiguration configuration)
    {
        _repository = repository;
        _configuration = configuration;
    }

    public async Task<User> CreateAsync(RegisterUserDto dto)
    {
        var user = new User
        {
            FullName = dto.FullName,
            Address = dto.Address,
            City = dto.City,
            State = dto.State,
            ZipCode = dto.ZipCode,
            Email = dto.Email,
            Password = Argon2.Hash(dto.Password),
            Phone = dto.Phone,
            CreatedAt = DateOnly.FromDateTime(DateTime.Now),
            Active = true,
            Role = "Client"
        };

        await _repository.AddAsync(user);
        await _repository.SaveChangesAsync();
        return user;
    }

    public async Task<string?> AuthenticateAsync(LoginDto login)
    {
        var user = await _repository.FindByEmailAsync(login.Email);
        if (user == null || !Argon2.Verify(user.Password, login.Password))
        {
            return null;
        }

        return GenerateJwtToken(user);
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<UserDetailsDto?> GetDetailsAsync(long id)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user == null) return null;

        return new UserDetailsDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Active = user.Active,
            CreatedAt = user.CreatedAt,
            Role = user.Role
        };
    }

    public async Task DeactivateAsync(long id)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user != null)
        {
            user.Active = false;
            _repository.Update(user);
            await _repository.SaveChangesAsync();
        }
    }

    public async Task<User> UpdateUserAsync(User user)
    {
        _repository.Update(user);
        await _repository.SaveChangesAsync();
        return user;
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = Encoding.ASCII.GetBytes(jwtSettings["SecretKey"] ?? "super_secret_key_must_be_long_enough");

        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Email ?? ""),
                new Claim(ClaimTypes.Role, user.Role)
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"]
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
