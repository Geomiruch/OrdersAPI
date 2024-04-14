using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrdersAPI.Contracts;
using OrdersAPI.Data;
using OrdersAPI.Models;
using OrdersAPI.Services;

namespace OrdersAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : Controller
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost("Create")]
        public async Task<ActionResult<ProductContract>> CreateProduct(ProductContract productContract)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdProduct = await _productService.CreateProduct(productContract);
                return CreatedAtAction("GetProduct", new { id = createdProduct.Id }, createdProduct);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error creating product");
            }
        }

        [HttpGet("Read")]
        public async Task<ActionResult<IEnumerable<ProductContract>>> GetProducts()
        {
            try
            {
                var products = await _productService.GetProducts();
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving products");
            }
        }

        [HttpGet("Read/{id}")]
        public async Task<ActionResult<ProductContract>> GetProduct(int id)
        {
            try
            {
                var product = await _productService.GetProductById(id);

                if (product == null)
                {
                    return NotFound();
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving product");
            }
        }

        [HttpGet("Read/code/{code}")]
        public async Task<ActionResult<ProductContract>> GetProductByCode(string code)
        {
            try
            {
                var product = await _productService.GetProductByCode(code);

                if (product == null)
                {
                    return NotFound();
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving product");
            }
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductContract productContract)
        {
            try
            {
                if (id != productContract.Id)
                {
                    return BadRequest("Id mismatch");
                }

                await _productService.UpdateProduct(productContract);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating product");
            }
        }
    }

}
