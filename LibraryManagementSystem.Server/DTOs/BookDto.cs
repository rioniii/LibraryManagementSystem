using LibraryManagementSystem.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace LibraryManagementSystem.Server.DTOs
{
    public class BookDto
    {
        [Key]
        public int BookId { get; set; }
        public string ISBN { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int PublicationYear { get; set; }
        public string Publisher { get; set; } = string.Empty;
        public int TotalCopies { get; set; }
        public string Description { get; set; } = string.Empty;
        public string CoverImageURL { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public DateTime AddedDate { get; set; }
        public BookStatus Status { get; set; }
        
        // Include only the Category name, not the entire Category object
        public string CategoryName { get; set; } = string.Empty;
    }
} 