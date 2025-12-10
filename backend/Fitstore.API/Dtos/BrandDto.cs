namespace Fitstore.API.Dtos;

public class BrandDto
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public int ProductCount { get; set; }
}

public class CreateBrandDto
{
    public string Name { get; set; } = string.Empty;
}

public class UpdateBrandDto
{
    public string? Name { get; set; }
}
