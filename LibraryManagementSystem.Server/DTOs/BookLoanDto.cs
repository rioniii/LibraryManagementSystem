using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LibraryManagementSystem.Server.DTOs
{
    public class BookLoanDto
    {
        [Required]
        public int BookId { get; set; }

        [Required]
        public string UserId { get; set; } 

        [Required]
        public DateTime LoanDate { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        public DateTime? ReturnDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal? FineAmount { get; set; }
    }
}