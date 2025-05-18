using System;

namespace LibraryManagementSystem.Server.Models
{
    public class ContactSubmission
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime SubmissionDate { get; set; }
    }
} 