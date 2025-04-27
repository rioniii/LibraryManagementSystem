namespace LibraryManagementSystem.Server.Models
{
    public enum BookStatus
    {
        Available,
        Borrowed,
        Reserved,
        Lost,
        Damaged,
        Removed // e.g., withdrawn from circulation
    }
} 