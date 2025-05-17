using LibraryManagementSystem.Server.Data;
using LibraryManagementSystem.Server.Models;
using LibraryManagementSystem.Server.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace LibraryManagementSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks()
        {
            return await _context.Books
                .Include(b => b.Category)
                .Select(b => new BookDto
                {
                    BookId = b.BookId,
                    ISBN = b.ISBN,
                    Title = b.Title,
                    Author = b.Author,
                    PublicationYear = b.PublicationYear,
                    Publisher = b.Publisher,
                    TotalCopies = b.TotalCopies,
                    Description = b.Description,
                    CoverImageURL = b.CoverImageURL,
                    Location = b.Location,
                    AddedDate = b.AddedDate,
                    Status = b.Status,
                    CategoryName = b.Category.Name
                })
                .ToListAsync();
        }

        // GET: api/books/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            var book = await _context.Books
                .Include(b => b.Category)
                .Where(b => b.BookId == id)
                .Select(b => new BookDto
                {
                    BookId = b.BookId,
                    ISBN = b.ISBN,
                    Title = b.Title,
                    Author = b.Author,
                    PublicationYear = b.PublicationYear,
                    Publisher = b.Publisher,
                    TotalCopies = b.TotalCopies,
                    Description = b.Description,
                    CoverImageURL = b.CoverImageURL,
                    Location = b.Location,
                    AddedDate = b.AddedDate,
                    Status = b.Status,
                    CategoryName = b.Category.Name
                })
                .FirstOrDefaultAsync();

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        // GET: api/Book/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        // POST: api/books
        [HttpPost]
        public async Task<ActionResult<BookDto>> PostBook(BookCreateDto bookDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var book = new Book
            {
                ISBN = bookDto.ISBN,
                Title = bookDto.Title,
                Author = bookDto.Author,
                PublicationYear = bookDto.PublicationYear,
                Publisher = bookDto.Publisher,
                TotalCopies = bookDto.TotalCopies,
                Description = bookDto.Description,
                CoverImageURL = bookDto.CoverImageURL,
                Location = bookDto.Location,
                AddedDate = DateTime.UtcNow,
                CategoryId = bookDto.CategoryId,
                Status = bookDto.Status
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            var createdBook = await _context.Books.Include(b => b.Category).FirstOrDefaultAsync(b => b.BookId == book.BookId);

            var bookDtoResult = new BookDto
            {
                BookId = createdBook.BookId,
                ISBN = createdBook.ISBN,
                Title = createdBook.Title,
                Author = createdBook.Author,
                PublicationYear = createdBook.PublicationYear,
                Publisher = createdBook.Publisher,
                TotalCopies = createdBook.TotalCopies,
                Description = createdBook.Description,
                CoverImageURL = createdBook.CoverImageURL,
                Location = createdBook.Location,
                AddedDate = createdBook.AddedDate,
                Status = createdBook.Status,
                CategoryName = createdBook.Category?.Name ?? string.Empty
            };

            return CreatedAtAction(nameof(GetBook), new { id = book.BookId }, bookDtoResult);
        }

        // PUT: api/books/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, BookDto bookDto)
        {
            if (id != bookDto.BookId)
            {
                return BadRequest("Book ID mismatch");
            }

            var existingBook = await _context.Books.FindAsync(id);
            if (existingBook == null)
            {
                return NotFound();
            }

            // Update only the properties that should be updated
            existingBook.ISBN = bookDto.ISBN;
            existingBook.Title = bookDto.Title;
            existingBook.Author = bookDto.Author;
            existingBook.PublicationYear = bookDto.PublicationYear;
            existingBook.Publisher = bookDto.Publisher;
            existingBook.TotalCopies = bookDto.TotalCopies;
            existingBook.Description = bookDto.Description;
            existingBook.CoverImageURL = bookDto.CoverImageURL;
            existingBook.Location = bookDto.Location;
            existingBook.AddedDate = bookDto.AddedDate;
            existingBook.Status = bookDto.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/books/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookExists(int id)
        {
            return _context.Books.Any(e => e.BookId == id);
        }
    }
}
