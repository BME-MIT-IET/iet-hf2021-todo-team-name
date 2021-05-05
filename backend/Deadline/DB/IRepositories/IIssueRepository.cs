using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Deadline.API;

namespace Deadline.DB.IRepositories
{
    public interface IIssueRepository
    {
        public Task<List<ClientIssue>> GetIssues(string userID);
        public Task<ClientIssue> AddIssue(string userID, ClientIssue client);
        public Task<ClientIssue> UpdateIssue(string userID, ClientIssue client);
        public Task<ClientIssue> GetIssue(string userID, string id);
        public Task<string> DeleteIssue(string userID, string id);
        public Task<List<ClientIssue>> Search(string userid, string query, CancellationToken cancellationToken = default(CancellationToken));
    }
}
