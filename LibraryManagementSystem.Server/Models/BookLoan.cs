using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagementSystem.Server.Models
{
    public class BookLoan // Renamed from Loan
    {
        public int BookLoanId { get; set; } // Renamed from LoanId

        public int BookId { get; set; } // Foreign Key to Book
        public virtual Book? Book { get; set; } // Navigation property

        // Changed Foreign Key from MemberId to Id (string) for ApplicationUser (IdentityUser)
        public string UserId { get; set; } = string.Empty;
        public virtual ApplicationUser? User { get; set; } // Navigation property to ApplicationUser

        public DateTime LoanDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? ReturnDate { get; set; } // Nullable if not returned yet

        // Added properties from diagram
        public string Status { get; set; } = string.Empty; // Consider using an enum later

        [Column(TypeName = "decimal(18, 2)")] // Specify SQL Server column type for decimal
        public decimal FineAmount { get; set; } // Nullable if not applicable
    }
}