using System.ComponentModel.DataAnnotations.Schema;

namespace Fitstore.API.Models;

[Table("brands")]
public class Brand
{
    public long Id { get; set; }
    public string? Name { get; set; }
}
