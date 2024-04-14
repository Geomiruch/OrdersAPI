using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OrdersAPI.Contracts
{
    public class OrderResponseContract
    {
        public int Id { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CustomerFullName { get; set; }
        public string CustomerPhone { get; set; }
        public List<ProductResponseContract> Products { get; set; }
    }
}
