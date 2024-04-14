using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OrdersAPI.Models
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy HH:mm:ss}", ApplyFormatInEditMode = true)]
        public DateTime CreatedOn { get; set; }
        [Required(ErrorMessage = "CustomerFullName is required")]
        public string CustomerFullName { get; set; }
        [Required(ErrorMessage = "CustomerPhone is required")]
        [Phone(ErrorMessage = "Invalid phone number")]
        public string CustomerPhone { get; set; }
    }
}
