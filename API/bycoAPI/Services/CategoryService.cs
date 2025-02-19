using bycoAPI.Interfaces;
using bycoAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace bycoAPI.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly DbContexts _dbcontext;
        public CategoryService(DbContexts dbContext) { 
            _dbcontext = dbContext;
        }

        public async Task<RequestResponse> Add(Category category)
        {
            RequestResponse response = new RequestResponse();

            Category cdb = new Category();
            cdb.ad = category.ad;
            cdb.parent = category.parent;
            cdb.urunturu = category.urunturu;

            try
            {
                await _dbcontext.Categories.AddAsync(cdb);
                await _dbcontext.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                response.StatusCode = 500;
                response.ReasonString = category.ad + " can not recognized!";
                return response;
            }

            response.StatusCode = 200;
            response.ReasonString = "Succesfully added!";


            return response;
        }

        public async Task<RequestResponse> Delete(int id)
        {
            RequestResponse response = new RequestResponse();

            Category category = await _dbcontext.Categories.FindAsync(id);

            _dbcontext.Categories.Remove(category);
            await _dbcontext.SaveChangesAsync();

            response.StatusCode = 200;
            response.ReasonString = " successfully removed!";
            return response;
        }

        public async Task<List<Category>> GetAll()
        {
            List<Category> categories = _dbcontext.Categories.ToList();
            return categories;
        }

        public async Task<List<Category>> GetCategoryByUrunTuru(string urunTuru)
        {
            List<Category> categories = await _dbcontext.Categories.Where(c => c.urunturu == urunTuru).ToListAsync();
            if(categories.IsNullOrEmpty()) return [];
            return categories;
        }
    }
}