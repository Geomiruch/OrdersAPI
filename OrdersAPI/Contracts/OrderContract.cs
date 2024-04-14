using OrdersAPI.Models;

namespace OrdersAPI.Contracts
{
    public class OrderContract
    {
        public Order Order { get; set; }
        public IEnumerable<ProductAmount> Products { get; set; }
    }
}
