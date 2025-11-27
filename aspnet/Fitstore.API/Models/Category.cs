using System.ComponentModel.DataAnnotations.Schema;

namespace Fitstore.API.Models;

[Table("categories")]
public class Category
{
    public long Id { get; set; }
    public string? Name { get; set; }
}
