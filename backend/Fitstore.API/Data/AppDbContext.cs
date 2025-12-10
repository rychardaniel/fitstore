using Fitstore.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitstore.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Brand> Brands { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Wishlist> Wishlists { get; set; }
    public DbSet<WishlistItem> WishlistItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure OrderStatus enum as string
        modelBuilder.Entity<Order>()
            .Property(p => p.Status)
            .HasConversion<string>();

        // Configure unique constraint for wishlist user
        modelBuilder.Entity<Wishlist>()
            .HasIndex(w => w.UserId)
            .IsUnique();

        // Configure unique constraint for review per user per product
        modelBuilder.Entity<Review>()
            .HasIndex(r => new { r.UserId, r.ProductId })
            .IsUnique();
    }
}

