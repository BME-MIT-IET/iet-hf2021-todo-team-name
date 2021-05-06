using Deadline.API;
using Deadline.DB.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace web_api_tests.FakeRepositories
{
    class FakeWorkspaceRepository : IWorkspaceRepository
    {
        
        public Task<ClientWorkspace> AddUser(string id, string userID)
        {
            throw new NotImplementedException();
        }

        public Task<ClientWorkspace> ChangeUsers(string id, List<string> userIDs)
        {
            throw new NotImplementedException();
        }

        public Task<ClientWorkspace> Create(string name, string userID)
        {
            throw new NotImplementedException();
        }

        public Task<List<ClientWorkspace>> GetAll(string userID)
        {
            throw new NotImplementedException();
        }

        public Task<ClientWorkspace> GetWorkspace(string id)
        {
            throw new NotImplementedException();
        }
    }
}
