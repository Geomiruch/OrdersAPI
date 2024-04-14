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
            await _context.SaveChangesAsync();
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
            var orderResponseContracts = await _context.Orders.Select(x => _mapper.Map<OrderResponseContract>(x)).ToListAsync();
            foreach (var orderResponseContract in orderResponseContracts)
            {
                orderResponseContract.Products = new List<ProductResponseContract>();
                var orderProducts = await _context.OrderProducts.Where(x => x.OrderId == orderResponseContract.Id).ToListAsync();
                foreach(var orderProduct in orderProducts)
                {
                    orderResponseContract.Products.Add(_mapper.Map<ProductResponseContract>(await _context.Products.FindAsync(orderProduct.ProductId)));
                }
            }
            return orderResponseContracts;
        }

        public async Task<OrderResponseContract> GetOrderById(int id)
        {
            var orderResponseContract = _mapper.Map<OrderResponseContract>(await _context.Orders.FindAsync(id));
            if (orderResponseContract == null)
            {
                return null;
            }
            orderResponseContract.Products = new List<ProductResponseContract>();
            var orderProducts = await _context.OrderProducts.Where(x => x.OrderId == orderResponseContract.Id).ToListAsync();
            foreach (var orderProduct in orderProducts)
            {
                orderResponseContract.Products.Add(_mapper.Map<ProductResponseContract>(await _context.Products.FindAsync(orderProduct.ProductId)));
            }
            return orderResponseContract;
        }
    }
}
