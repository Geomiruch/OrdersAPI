using AutoMapper;
using Microsoft.EntityFrameworkCore;
using OrdersAPI.Contracts;
using OrdersAPI.Data;
using OrdersAPI.Models;

namespace OrdersAPI.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public OrderService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<OrderContract> CreateOrder(OrderContract orderContract)
        {
            _context.Orders.Add(orderContract.Order);
            var order = orderContract.Order;
            foreach (var prod in orderContract.Products)
            {
                var product = _context.Products.First(x => x.Id == prod.ProductId);
                _context.OrderProducts.Add(new OrderProduct
                {
                    Order = order,
                    Product = product,
                    Amount = prod.Amount,
                    TotalPrice = product.Price * prod.Amount
                });
            }
            await _context.SaveChangesAsync();
            return orderContract;
        }

        public async Task<IEnumerable<OrderResponseContract>> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                .ToListAsync();

            var orderResponseContracts = new List<OrderResponseContract>();

            foreach (var order in orders)
            {
                var orderResponseContract = _mapper.Map<OrderResponseContract>(order);
                orderResponseContract.Products = new List<ProductResponseContract>();

                foreach (var orderProduct in order.OrderProducts)
                {
                    var productResponseContract = _mapper.Map<ProductResponseContract>(orderProduct.Product);
                    orderResponseContract.Products.Add(productResponseContract);
                }

                orderResponseContracts.Add(orderResponseContract);
            }

            return orderResponseContracts;
        }

        public async Task<OrderResponseContract> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return null;
            }

            var orderResponseContract = _mapper.Map<OrderResponseContract>(order);
            orderResponseContract.Products = new List<ProductResponseContract>();

            foreach (var orderProduct in order.OrderProducts)
            {
                var productResponseContract = _mapper.Map<ProductResponseContract>(orderProduct.Product);
                orderResponseContract.Products.Add(productResponseContract);
            }

            return orderResponseContract;
        }
    }
}
