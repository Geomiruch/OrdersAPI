﻿namespace OrdersAPI.Contracts
{
    public class ProductContract
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
    }
}
