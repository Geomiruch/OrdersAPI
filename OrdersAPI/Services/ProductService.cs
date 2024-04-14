using AutoMapper;
using Microsoft.EntityFrameworkCore;
using OrdersAPI.Contracts;
using OrdersAPI.Data;
using OrdersAPI.Models;

namespace OrdersAPI.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ProductService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ProductContract> CreateProduct(ProductContract productContract)
        {
            var product = _mapper.Map<Product>(productContract);
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return productContract;
        }

        public async Task<IEnumerable<ProductContract>> GetProducts()
        {
            return await _context.Products.Select(x => _mapper.Map<ProductContract>(x)).ToListAsync();
        }

        public async Task<ProductContract> GetProductById(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if(product == null)
            {
                return null;
            }
            return _mapper.Map<ProductContract>(product);
        }

        public async Task<ProductContract> GetProductByCode(string code)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Code == code);
            if (product == null)
            {
                return null;
            }
            return _mapper.Map<ProductContract>(product);
        }

        public async Task UpdateProduct(ProductContract productContract)
        {
            var product = _mapper.Map<Product>(productContract);
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }

}
