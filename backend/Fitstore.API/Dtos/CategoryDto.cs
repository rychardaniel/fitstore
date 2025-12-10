namespace Fitstore.API.Dtos;

public class CategoryDto
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public int ProductCount { get; set; }
}

public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
}

public class UpdateCategoryDto
{
    public string? Name { get; set; }
}
