using Deadline.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Deadline.DB.IRepositories
{
    public interface IClassRepository
    {
        public Task<List<Class>> GetClasses(string id);
        public Task<Class> AddClass(string userID, Class newClass);
        public Task<Class> GetClass(string userID, string classID);
        public Task<Class> UpdateClass(string userID, Class updated);
        public Task<Class> DeleteClass(string userID, string deleteID);
    }
}
