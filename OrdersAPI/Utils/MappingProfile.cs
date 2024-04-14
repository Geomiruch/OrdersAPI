using AutoMapper;
using OrdersAPI.Contracts;
using OrdersAPI.Models;

namespace OrdersAPI.Utils
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ProductContract, Product>().ReverseMap();
            CreateMap<Order, OrderResponseContract>().ReverseMap();
            CreateMap<Product, ProductResponseContract>().ReverseMap();
        }
    }
}
