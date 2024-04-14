using Microsoft.EntityFrameworkCore;
using OrdersAPI.Contracts;
using OrdersAPI.Models;

namespace OrdersAPI.Services
{
    public interface IOrderService
    {
        public Task<OrderContract> CreateOrder(OrderContract order);
        public Task<IEnumerable<OrderResponseContract>> GetOrders();
        public Task<OrderResponseContract> GetOrderById(int id);
    }
}
