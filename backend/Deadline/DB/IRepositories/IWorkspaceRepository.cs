using System.Collections.Generic;
using System.Threading.Tasks;
using Deadline.API;

namespace Deadline.DB.IRepositories
{
    public interface IWorkspaceRepository
    {
        public Task<ClientWorkspace> Create(string name, string userID);
        public Task<ClientWorkspace> GetWorkspace(string id);
        public Task<List<ClientWorkspace>> GetAll(string userID);
        public Task<ClientWorkspace> AddUser(string id, string userID);
        public Task<ClientWorkspace> ChangeUsers(string id, List<string> userIDs);
    }
}
