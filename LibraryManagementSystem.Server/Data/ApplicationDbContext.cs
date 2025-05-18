using LibraryManagementSystem.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using LibraryManagementSystem.Server.DTOs;
using Microsoft.AspNetCore.Identity;

namespace LibraryManagementSystem.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSet properties for our models
        public DbSet<Book> Books { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<BookLoan> BookLoans { get; set; }
        public DbSet<ContactSubmission> ContactSubmissions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); // Important for Identity configuration

            // Configure decimal precision for FineAmount in BookLoan
            builder.Entity<BookLoan>()
                .Property(bl => bl.FineAmount)
                .HasColumnType("decimal(18, 2)");

            // Configure relationships (optional - EF Core conventions might handle these)

            // Book <-> Category (One-to-Many)
            builder.Entity<Book>()
                .HasOne(b => b.Category)
                .WithMany(c => c.Books)
                .HasForeignKey(b => b.CategoryId);

            // Book <-> BookLoan (One-to-Many)
            builder.Entity<BookLoan>()
                .HasOne(bl => bl.Book)
                .WithMany(b => b.BookLoans)
                .HasForeignKey(bl => bl.BookId);

            // ApplicationUser <-> BookLoan (One-to-Many)
            builder.Entity<BookLoan>()
                .HasOne(bl => bl.User) // Changed from Member
                .WithMany(u => u.BookLoans)
                .HasForeignKey(bl => bl.UserId); // Changed from MemberId

            // Add any additional configurations, constraints, or seed data here
        }
    }
} 