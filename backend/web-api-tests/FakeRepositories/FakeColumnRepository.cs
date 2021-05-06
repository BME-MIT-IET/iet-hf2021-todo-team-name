using Deadline.API;
using Deadline.DB.IRepositories;
using Deadline.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace web_api_tests.FakeRepositories
{
    class FakeColumnRepository : IColumnRepository
    {

        private List<Issue> issues;

        private IIssueRepository issueRepository;
        
        public FakeColumnRepository()
        {
            issues = new List<Issue>
            {

            };

            issueRepository = new FakeIssueRepository();
        }
        public Task<ClientColumn> AddColumn(string userID, ClientColumn column)
        {
            throw new NotImplementedException();
        }

        public Task<ClientColumn> AddIssue(string userID, string columnid, string issueid)
        {
            throw new NotImplementedException();
        }

        public Task<ClientColumn> CreateIssueAndAdd(string userID, ClientIssue clientIssue, string columnid)
        {
            throw new NotImplementedException();
        }

        public Task<string> DeleteColumn(string userID, string id)
        {
            throw new NotImplementedException();
        }

        public Task<ClientColumn> GetColumn(string userID, string columnid)
        {
            throw new NotImplementedException();
        }

        public Task<List<ClientColumn>> GetColumns(string userID)
        {
            throw new NotImplementedException();
        }

        public Task<string> MoveIssue(string userID, string originid, string destinationid, string issueid)
        {
            throw new NotImplementedException();
        }

        public Task<string> RemoveIssue(string userID, string columnid, string issueid)
        {
            throw new NotImplementedException();
        }

        public Task<ClientColumn> UpdateColumn(string userID, ClientColumn column)
        {
            throw new NotImplementedException();
        }
    }
}
