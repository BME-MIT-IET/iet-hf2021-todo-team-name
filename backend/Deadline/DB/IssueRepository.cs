using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Deadline.API;
using Deadline.DB.IRepositories;
using Deadline.Entities;
using MongoDB.Driver;

namespace Deadline.DB
{
    public class IssueRepository : IIssueRepository
    {
        private readonly Database db;
        public IssueRepository(Database db) => this.db = db;
        private async Task<List<ClientIssue>> PopulateList(List<Issue> issues)
        {
            List<ClientIssue> clients = new List<ClientIssue>();
            foreach (var issue in issues)
            {
                clients.Add(await Populate(issue));
            }
            return clients;
        }
        private async Task<ClientIssue> Populate(Issue issue)
        {
            ClientIssue client = new ClientIssue(issue);
            var relevantClass = await db.Classes.Find(item => item.ID == issue.relevantClass).FirstOrDefaultAsync();
            client.relevantClass = relevantClass;
            if (issue.labels != null) client.labels = await db.Labels.Find(item => issue.labels.Contains(item.ID)).ToListAsync();
            return client;
        }

        public async Task<List<ClientIssue>> GetIssues(string userID)
        {
            var issues = await db.Issues.Find(item => item.userID == userID).ToListAsync();
            return await PopulateList(issues);
        }
        public async Task<ClientIssue> AddIssue(string userID, ClientIssue client)
        {
            var issue = client.Convert();
            issue.userID = userID;
            await db.Issues.InsertOneAsync(issue);
            return new ClientIssue(issue);
        }
        public async Task<ClientIssue> UpdateIssue(string userID, ClientIssue client)
        {
            Issue toEdit = await db.Issues.Find(item => item.ID == client.ID).FirstOrDefaultAsync();

            if (toEdit == null)
            {
                return null;
            }
            else
            {
                Issue newIssue = client.Convert();
                newIssue.userID = userID;

                await db.Issues.ReplaceOneAsync(item => item.ID == newIssue.ID, newIssue);

                return new ClientIssue(newIssue);
            }
        }
        public async Task<ClientIssue> GetIssue(string userID, string id)
        {
            Issue issue = await db.Issues.Find(item => item.ID == id).FirstOrDefaultAsync();

            if (issue == null) return null;

            return new ClientIssue(issue);
        }
        public async Task<string> DeleteIssue(string userID, string id)
        {
            var res = await db.Issues.DeleteOneAsync(item => item.ID == id);
            return id;
        }
        public async Task<List<ClientIssue>> Search(string userid, string query, CancellationToken cancellationToken = default(CancellationToken))
        {
            string lower = query.ToLower();
            var res = await db.Issues.FindAsync(item => item.userID == userid && (item.title.ToLower().Contains(lower) || item.body.ToLower().Contains(lower)), null, cancellationToken).Result.ToListAsync();
            return await PopulateList(res);
        }
    }
}
