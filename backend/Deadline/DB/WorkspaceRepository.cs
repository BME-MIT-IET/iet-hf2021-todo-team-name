using Deadline.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using Deadline.API;
using Deadline.DB.IRepositories;

namespace Deadline.DB
{
    public class WorkspaceRepository : IWorkspaceRepository
    {
        private Database db;
        public WorkspaceRepository(Database db) => this.db = db;

       private async Task<List<ClientColumn>> PopulateColumnList(List<Column> columns)
        {
            List<ClientColumn> clients = new List<ClientColumn>();
            foreach (var column in columns)
            {
                clients.Add(await PopulateColumn(column));
            }
            return clients;
        }
        private async Task<ClientColumn> PopulateColumn(Column column)
        {
            ClientColumn client = new ClientColumn(column);
            foreach (var issueid in column.issues)
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

        private async Task<ClientWorkspace> Populate(Workspace workspace)
        {
            var client = new ClientWorkspace(workspace);
            var columns = new List<Column>();
            foreach (var columnID in workspace.columns)
            {
                var column = await db.Columns.Find(item => item.ID == columnID).FirstOrDefaultAsync();
                if (column != null)
                    columns.Add(column);
            }
            client.columns = await PopulateColumnList(columns);
            var users = new List<User>();
            foreach (var userID in workspace.userIDs)
            {
                var user = await db.Users.Find(item => item.ID == userID).FirstOrDefaultAsync();
                if (user != null)
                    users.Add(user);
            }
            client.users = users;
            return client;
        }
        private async Task<List<ClientWorkspace>> PopulateList(List<Workspace> workspaces)
        {
            List<ClientWorkspace> clients = new List<ClientWorkspace>();
            foreach (var workspace in workspaces)
            {
                clients.Add(await Populate(workspace));
            }
            return clients;
        }

        public async Task<ClientWorkspace> Create(string name, string userID)
        {
            var pendingColumn = new Column
            {
                name = "Függőben",
                order = 1,
                userID = userID
             };
            await db.Columns.InsertOneAsync(pendingColumn);

            var doingColumn = new Column
            {
                name = "Folyamatban",
                order = 2,
                userID = userID
            };
            await db.Columns.InsertOneAsync(doingColumn);

            var doneColumn = new Column
            {
                name = "Kész",
                order = 3,
                userID = userID
            };
            await db.Columns.InsertOneAsync(doneColumn);

            var workspace = new Workspace();
            workspace.name = name;
            workspace.userIDs.Add(userID);
            workspace.columns.Add(pendingColumn.ID);
            workspace.columns.Add(doingColumn.ID);
            workspace.columns.Add(doneColumn.ID);
            await db.Workspaces.InsertOneAsync(workspace);
            return await Populate(workspace);
        }

        public async Task<ClientWorkspace> GetWorkspace(string id)
        {
            var workspace = await db.Workspaces.Find(item => item.ID == id).FirstOrDefaultAsync();
            return await Populate(workspace);
        }
        public async Task<List<ClientWorkspace>> GetAll(string userID)
        {
            var workspaces = await db.Workspaces.Find(item => item.userIDs.Contains(userID)).ToListAsync();
            return await PopulateList(workspaces);
        }
        public async Task<ClientWorkspace> AddUser(string id, string userID)
        {
            if (db.Users.Find(item => item.ID == userID).FirstOrDefault() == null)
                throw new KeyNotFoundException();
            var updated = await db.Workspaces.FindOneAndUpdateAsync(item => item.ID == id, Builders<Workspace>.Update.Set(item => item.userIDs[-1], userID));
            return await Populate(updated);
        }
        public async Task<ClientWorkspace> ChangeUsers(string id, List<string> userIDs)
        {
            //var updated = await db.Workspaces.FindOneAndUpdateAsync(item => item.ID == id, Builders<Workspace>.Update.Set(item => item.userIDs, userIDs));
            //return await Populate(updated);
            var workspace = await db.Workspaces.Find(item => item.ID == id).FirstOrDefaultAsync();
            workspace.userIDs = userIDs;
            await db.Workspaces.FindOneAndReplaceAsync(item => item.ID == id, workspace);
            return await Populate(workspace);
        }
    }
}
