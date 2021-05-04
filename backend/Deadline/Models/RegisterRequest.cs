using System.ComponentModel.DataAnnotations;

namespace Deadline.Models
{
    public class RegisterRequest
    {
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
        [Required]
        public string Name { get; set; }
    }
}