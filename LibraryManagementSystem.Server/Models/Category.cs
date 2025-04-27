using System.Collections.Generic;

namespace LibraryManagementSystem.Server.Models
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Navigation property for Books in this Category
        public virtual ICollection<Book> Books { get; set; } = new List<Book>();
    }
} 