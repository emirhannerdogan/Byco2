using bycoAPI.Models;

namespace bycoAPI.Interfaces
{
    public interface ICategoryService
    {
        public Task<RequestResponse> Add(Category category);
        public Task<List<Category>> GetCategoryByUrunTuru(string urunturu);
        public Task<List<Category>> GetAll();
        public Task<RequestResponse> Delete(int id);
    }
}