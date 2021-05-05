using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deadline.API;
using Deadline.DB.IRepositories;
using Deadline.Entities;
using MongoDB.Driver;

namespace Deadline.DB
{
    public class ColumnRepository : IColumnRepository
    {
        private readonly Database db;

        public ColumnRepository(Database db) => this.db = db;

        private async Task<List<ClientColumn>> PopulateList(List<Column> columns)
        {
            List<ClientColumn> clients = new List<ClientColumn>();
            foreach(var column in columns)
            {
                clients.Add(await Populate(column));
            }
            return clients;
        }
        private async Task<ClientColumn> Populate(Column column)
        {
            ClientColumn client = new ClientColumn(column);
            foreach(var issueid in column.issues)
            {
                var issue = await db.Issues.Find(issue => issue.ID == issueid).FirstOrDefaultAsync();
                if (issue == null) continue;
                var relevantClass = await db.Classes.Find(item => item.ID == issue.relevantClass).FirstOrDefaultAsync();
                var clientIssue = new ClientIssue(issue);
                clientIssue.relevantClass = relevantClass;
                if (issue.labels != null) clientIssue.labels = await db.Labels.Find(item => issue.labels.Contains(item.ID)).ToListAsync();
                client.issues.Add(clientIssue);
            }
            return client;
        }

        public async Task<List<ClientColumn>> GetColumns(string userID)
        {
            var columns = await db.Columns.Find(column => column.userID == userID).ToListAsync();
            return await PopulateList(columns);
        }
        public async Task<ClientColumn> AddColumn(string userID, ClientColumn column)
        {
            Column insert = column.Convert();
            insert.userID = userID;
            await db.Columns.InsertOneAsync(insert);
            return new ClientColumn(insert);
        }
        public async Task<ClientColumn> UpdateColumn(string userID, ClientColumn column)
        {
            Column update = column.Convert();
            await db.Columns.FindOneAndReplaceAsync(item => item.ID == update.ID && item.userID == userID, update);
            return new ClientColumn(update);
        }
        public async Task<string> DeleteColumn(string userID, string id)
        {
            await db.Columns.FindOneAndDeleteAsync(item => item.ID == id && item.userID == userID);
            return id;
        }
        public async Task<ClientColumn> AddIssue(string userID, string columnid, string issueid)
        {
            var issue = await db.Issues.Find(issue => issue.ID == issueid && issue.userID == userID).FirstOrDefaultAsync();
            if (issue == null) return null;
            var column = await db.Columns.Find(column => column.ID == columnid && column.userID == userID).FirstOrDefaultAsync();
            if (column == null) return null;
            if (column.issues.Contains(issue.ID)) return null;
            column.issues.Add(issueid);
            await db.Columns.ReplaceOneAsync(item => item.ID == column.ID && column.userID == userID, column);

            return await Populate(column);
        }
        public async Task<ClientColumn> CreateIssueAndAdd(string userID, ClientIssue clientIssue, string columnid)
        {
            var issue = clientIssue.Convert();
            issue.userID = userID;
            await db.Issues.InsertOneAsync(issue);
            return await AddIssue(userID, columnid, issue.ID);
        }
        public async Task<ClientColumn> GetColumn(string userID, string columnid)
        {
            var column = await db.Columns.Find(column => column.ID == columnid && column.userID == userID).FirstOrDefaultAsync();
            return await Populate(column);
        }
        public async Task<string> MoveIssue(string userID, string originid, string destinationid, string issueid)
        {
            var originColumn = db.Columns.Find(item => item.ID == originid && item.userID == userID).FirstOrDefault();
            if (originColumn == null) return "Column " + originid + " not found.";

            var destinationColumn = await db.Columns.Find(item => item.ID == destinationid && item.userID == userID).FirstOrDefaultAsync();
            if (destinationColumn == null) return "Column " + destinationid + " not found.";

            var issue = await db.Issues.Find(item => item.ID == issueid && item.userID == userID).FirstOrDefaultAsync();
            if (issue == null) return "Issue " + issueid + " not found.";

            if (!originColumn.issues.Contains(issue.ID)) return "Origin column doesn't contain the specified issue.";

            originColumn.issues.Remove(issueid);
            destinationColumn.issues.Add(issueid);
            db.Columns.FindOneAndReplace(item => item.ID == originid && item.userID == userID, originColumn);
            db.Columns.FindOneAndReplace(item => item.ID == destinationid && item.userID == userID, destinationColumn);
            return "";
        }

        public async Task<string> RemoveIssue(string userID, string columnid, string issueid)
        {
            var column = await db.Columns.Find(item => item.ID == columnid && item.userID == userID).FirstOrDefaultAsync();
            if (column == null) return "";

            if (!column.issues.Contains(issueid)) return "";
            column.issues.Remove(issueid);
            return issueid;

        }
    }
}
