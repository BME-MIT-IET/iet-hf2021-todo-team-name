using System.Collections.Generic;
using System.Threading.Tasks;
using Deadline.API;

namespace Deadline.DB.IRepositories
{
    public interface IColumnRepository
    {
        public Task<List<ClientColumn>> GetColumns(string userID);
        public Task<ClientColumn> AddColumn(string userID, ClientColumn column);
        public Task<ClientColumn> UpdateColumn(string userID, ClientColumn column);
        public Task<string> DeleteColumn(string userID, string id);
        public Task<ClientColumn> AddIssue(string userID, string columnid, string issueid);
        public Task<ClientColumn> CreateIssueAndAdd(string userID, ClientIssue clientIssue, string columnid);
        public Task<ClientColumn> GetColumn(string userID, string columnid);
        public Task<string> MoveIssue(string userID, string originid, string destinationid, string issueid);
        public Task<string> RemoveIssue(string userID, string columnid, string issueid);
    }
}
