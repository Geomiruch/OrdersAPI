using Microsoft.EntityFrameworkCore;
using OrdersAPI.Contracts;
using OrdersAPI.Models;

namespace OrdersAPI.Services
{
    public interface IProductService
    {
        public Task<ProductContract> CreateProduct(ProductContract productContract);
        public Task<IEnumerable<ProductContract>> GetProducts();
        public Task<ProductContract> GetProductById(int id);
        public Task<ProductContract> GetProductByCode(string code);
        public Task UpdateProduct(ProductContract product);
    }
}
