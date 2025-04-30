using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LibraryManagementSystem.Server.DTOs
{
    public class BookLoanDto
    {
        public int BookLoanId { get; set; }
        public int BookId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public DateTime? LoanDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public string BookTitle { get; set; } = string.Empty;
    }
}