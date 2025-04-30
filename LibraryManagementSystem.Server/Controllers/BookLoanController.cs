using LibraryManagementSystem.Server.Data;
using LibraryManagementSystem.Server.Models;
using LibraryManagementSystem.Server.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

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
        public async Task<ActionResult<IEnumerable<BookLoanDto>>> GetBookLoans()
        {
            var loans = await _context.BookLoans
                .Include(bl => bl.Book)
                .Include(bl => bl.User)
                .Select(bl => new BookLoanDto
                {
                    BookLoanId = bl.BookLoanId,
                    BookId = bl.BookId,
                    BookTitle = bl.Book != null ? bl.Book.Title : "",
                    UserName = bl.User != null ? bl.User.UserName ?? "" : "",
                    LoanDate = bl.LoanDate,
                    ReturnDate = bl.ReturnDate ?? DateTime.MinValue
                })
                .ToListAsync();

            return Ok(loans);
        }

        // GET: api/bookloan/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BookLoanDto>> GetBookLoan(int id)
        {
            var loan = await _context.BookLoans
                .Include(bl => bl.Book)
                .Include(bl => bl.User)
                .Where(bl => bl.BookLoanId == id)
                .Select(bl => new BookLoanDto
                {
                    BookLoanId = bl.BookLoanId,
                    BookId = bl.BookId,
                    BookTitle = bl.Book != null ? bl.Book.Title : "",
                    UserName = bl.User != null ? bl.User.UserName ?? "" : "",
                    LoanDate = bl.LoanDate,
                    ReturnDate = bl.ReturnDate ?? DateTime.MinValue
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
                UserId = dto.UserName, // Nëse UserId = UserName, ndreq këtë përputhje sipas modelit tënd
                LoanDate = dto.LoanDate ?? DateTime.Now,
                ReturnDate = dto.ReturnDate
            };

            _context.BookLoans.Add(bookLoan);
            await _context.SaveChangesAsync();

            dto.BookLoanId = bookLoan.BookLoanId;

            return CreatedAtAction(nameof(GetBookLoan), new { id = dto.BookLoanId }, dto);
        }

        // PUT: api/bookloan/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookLoan(int id, BookLoan bookLoan)
        {
            if (id != bookLoan.BookLoanId)
                return BadRequest("BookLoan ID mismatch");

            var existingLoan = await _context.BookLoans.FindAsync(id);
            if (existingLoan == null)
                return NotFound();

            _context.Entry(existingLoan).State = EntityState.Detached;
            _context.Entry(bookLoan).State = EntityState.Modified;

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
