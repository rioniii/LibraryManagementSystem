using Microsoft.AspNetCore.Mvc;
using LibraryManagementSystem.Server.DTOs;
using LibraryManagementSystem.Server.Data;
using LibraryManagementSystem.Server.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System;

namespace LibraryManagementSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContactController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitContactForm([FromBody] ContactFormDto formData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var submission = new ContactSubmission
            {
                Name = formData.Name,
                Email = formData.Email,
                Subject = formData.Subject,
                Message = formData.Message,
                SubmissionDate = DateTime.UtcNow
            };

            _context.ContactSubmissions.Add(submission);
            await _context.SaveChangesAsync();

            // Return a success response
            return Ok("Contact form submitted successfully.");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactSubmission>>> GetContactSubmissions()
        {
            return await _context.ContactSubmissions.ToListAsync();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContactSubmission(int id)
        {
            var submission = await _context.ContactSubmissions.FindAsync(id);
            if (submission == null)
            {
                return NotFound();
            }

            _context.ContactSubmissions.Remove(submission);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 