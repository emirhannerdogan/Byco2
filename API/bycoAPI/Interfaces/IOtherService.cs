using bycoAPI.Models;
using Utils;

namespace bycoAPI.Interfaces
{
    public interface IOtherService
    {
        public Task<List<Others>> GetAll();
        public Task<RequestResponse> Update(Others other);
    }
}
