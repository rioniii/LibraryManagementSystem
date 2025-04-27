using System;
using System.Collections.Generic;

namespace LibraryManagementSystem.Server.Models
{
    public class Book
    {
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

        public int CategoryId { get; set; }
        public virtual Category? Category { get; set; }

        public virtual ICollection<BookLoan> BookLoans { get; set; } = new List<BookLoan>();
    }
}
