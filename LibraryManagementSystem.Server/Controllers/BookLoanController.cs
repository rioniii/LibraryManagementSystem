using LibraryManagementSystem.Server.Data;
using LibraryManagementSystem.Server.Models;
using LibraryManagementSystem.Server.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Security.Claims;

namespace LibraryManagementSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookLoanController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookLoanController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/bookloan
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetBookLoans()
        {
            var loans = await _context.BookLoans
                .Include(bl => bl.Book)
                .Include(bl => bl.User)
                .Select(bl => new {
                    bl.BookLoanId,
                    bl.BookId,
                    BookTitle = bl.Book != null ? bl.Book.Title : "",
                    bl.UserId,
                    UserName = bl.User != null ? bl.User.UserName ?? "" : "",
                    bl.LoanDate,
                    bl.DueDate,
                    bl.ReturnDate,
                    bl.Status,
                    bl.FineAmount
                })
                .ToListAsync();

            return Ok(loans);
        }

        // GET: api/bookloan/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetBookLoan(int id)
        {
            var loan = await _context.BookLoans
                .Include(bl => bl.Book)
                .Include(bl => bl.User)
                .Where(bl => bl.BookLoanId == id)
                .Select(bl => new {
                    bl.BookLoanId,
                    bl.BookId,
                    BookTitle = bl.Book != null ? bl.Book.Title : "",
                    bl.UserId,
                    UserName = bl.User != null ? bl.User.UserName ?? "" : "",
                    bl.LoanDate,
                    bl.DueDate,
                    bl.ReturnDate,
                    bl.Status,
                    bl.FineAmount
                })
                .FirstOrDefaultAsync();

            if (loan == null)
                return NotFound();

            return loan;
        }

        // POST: api/bookloan
        [HttpPost]
        public async Task<ActionResult<BookLoanDto>> PostBookLoan(BookLoanDto dto)
        {
            var bookLoan = new BookLoan
            {
                BookId = dto.BookId,
                UserId = dto.UserId,
                LoanDate = dto.LoanDate,
                DueDate = dto.DueDate,
                ReturnDate = dto.ReturnDate,
                Status = dto.Status,
                FineAmount = (decimal)dto.FineAmount
            };

            _context.BookLoans.Add(bookLoan);
            await _context.SaveChangesAsync();

            // Optionally return the created loan with extra info
            return CreatedAtAction(nameof(GetBookLoan), new { id = bookLoan.BookLoanId }, dto);
        }

        // GET: api/BookLoan/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetBookLoansByUser(string userId)
        {
            Console.WriteLine($"Received request for user ID: {userId}");

            var loans = await _context.BookLoans
                .Where(bl => bl.UserId == userId)
                .Include(bl => bl.Book)
                .Select(bl => new {
                    bl.BookLoanId,
                    bl.BookId,
                    BookTitle = bl.Book != null ? bl.Book.Title : "",
                    bl.UserId,
                    UserName = bl.User != null ? bl.User.UserName ?? "" : "",
                    bl.LoanDate,
                    bl.DueDate,
                    bl.ReturnDate,
                    bl.Status,
                    bl.FineAmount
                })
                .ToListAsync();

            Console.WriteLine($"Found {loans.Count} book loans for user ID: {userId}");

            if (loans == null || !loans.Any())
            {
                return NotFound("No book loans found for this user.");
            }

            return Ok(loans);
        }

        // PUT: api/bookloan/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookLoan(int id, BookLoanDto dto)
        {
            var existingLoan = await _context.BookLoans.FindAsync(id);
            if (existingLoan == null)
                return NotFound();

            existingLoan.BookId = dto.BookId;
            existingLoan.UserId = dto.UserId;
            existingLoan.LoanDate = dto.LoanDate;
            existingLoan.DueDate = dto.DueDate;
            existingLoan.ReturnDate = dto.ReturnDate;
            existingLoan.Status = dto.Status;
            existingLoan.FineAmount = (decimal)dto.FineAmount;

            _context.Entry(existingLoan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookLoanExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/bookloan/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookLoan(int id)
        {
            var loan = await _context.BookLoans.FindAsync(id);
            if (loan == null)
                return NotFound();

            _context.BookLoans.Remove(loan);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookLoanExists(int id)
        {
            return _context.BookLoans.Any(bl => bl.BookLoanId == id);
        }
    }
}
