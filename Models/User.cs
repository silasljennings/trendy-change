namespace TrendyChange.Models;
using System.ComponentModel.DataAnnotations;

public class User {

    [Key]
    public required int Id { get; set; }

    [Required]
    [Display(Name = "First Name")]
    public required string FirstName { get; set; }

    [Required]
    [Display(Name = "Last Name")]
    public required string LastName { get; set; }

    [Required]
    [Display(Name = "Email")]
    public required string Email { get; set; }

    [Required]
    [Display(Name = "Date of Birth")]
    public required int DateOfBirth { get; set; }

    [Required]
    [Display(Name = "Verified")]
    public required bool IsVerified { get; set; }

}

