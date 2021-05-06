using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Deadline.API;
using Deadline.DB.IRepositories;
using Deadline.Entities;
using MongoDB.Driver;

namespace web_api_tests.FakeRepositories
{
    public class FakeIssueRepository : IIssueRepository
    {
        private readonly List<Issue> issues;

        public FakeIssueRepository()
        {
            issues = new List<Issue>()
            {
                new Issue() { ID = "0", title = "iet_title", body = "iet_body", type = "iet_type", timespan = "10", userID = "0" },
                new Issue() { ID = "1", title = "test_title", body = "test_body", type = "test_type", timespan = "20", userID = "0" },
                new Issue() { ID = "2", title = "test_title2", body = "test_body2", type = "test_type2", timespan = "30", userID = "1" },
            };
        }

        public async Task<ClientIssue> AddIssue(string userID, ClientIssue client)
        {
            var issue = client.Convert();
            issue.userID = userID;
            issues.Add(issue);
            return new ClientIssue(issue);
        }

        public async Task<string> DeleteIssue(string userID, string id)
        {
            var toRemove = issues.FirstOrDefault(item => item.ID == id);
            issues.Remove(toRemove);
            return id;
        }

        public async Task<ClientIssue> GetIssue(string userID, string id)
        {
            Issue issue = issues.FirstOrDefault(item => item.ID == id);
            ClientIssue client = new ClientIssue(issue);
            return client;
        }

        private List<ClientIssue> ToClientList(List<Issue> issues)
        {
            List<ClientIssue> clients = new List<ClientIssue>();
            foreach (var issue in issues)
            {
                clients.Add(new ClientIssue(issue));
            }
            return clients;
        }

        public async Task<List<ClientIssue>> GetIssues(string userID)
        {
            var ret = issues.FindAll(item => item.userID == userID).ToList();

            return ToClientList(ret);
        }

        public async Task<List<ClientIssue>> Search(string userid, string query, CancellationToken cancellationToken = default)
        {
            string lower = query.ToLower();
            var res = issues.FindAll(item =>
                                    item.userID == userid
                                    && (
                                        item.title.ToLower().Contains(lower)
                                        ||
                                        item.body.ToLower().Contains(lower)
                                    )).ToList();
            
            return ToClientList(res);
        }

        public async Task<ClientIssue> UpdateIssue(string userID, ClientIssue client)
        {
            Issue issue = client.Convert();
            issue.userID = userID;
            issues.RemoveAll(item => item.ID == issue.ID);
            issues.Add(issue);
            return new ClientIssue(issue);
        }
    }
}
