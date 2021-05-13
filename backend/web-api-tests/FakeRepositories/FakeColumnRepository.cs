using Deadline.API;
using Deadline.DB.IRepositories;
using Deadline.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace web_api_tests.FakeRepositories
{
    class FakeColumnRepository : IColumnRepository
    {

        private List<Issue> issues;

        private List<Column> columns;

        private List<Class> classes;

        private List<Label> labels;
        
        public FakeColumnRepository()
        {

            classes = new List<Class>()
            {
                new Class() {ID = "1", color = "green", icon = "important", name="iet", userID = "0"},
                new Class() {ID = "2", color = "red", icon = "important", name="kliens", userID = "1"},
                new Class() {ID = "3", color = "red", icon = "important", name="kliens", userID = "2"},
                new Class() {ID = "4", color = "red", icon = "important", name="kliens", userID = "3"},
                new Class() {ID = "5", color = "green", icon = "finished", name="kliens", userID = "0"},
                new Class() {ID = "6", color = "yellow", icon = "line", name="it_biztonsag", userID = "1"}
            };

            labels = new List<Label>()
            {
                new Label() { ID = "0", name = "iet_name", type = "iet_type", userid = "0" },
                new Label() { ID = "1", name = "test_name", type = "test_type", userid = "0" },
                new Label() { ID = "2", name = "test_name2", type = "test_type2", userid = "1" },
            };

            issues = new List<Issue>()
            {
                new Issue() { ID = "0", title = "iet_title", body = "iet_body", type = "iet_type", timespan = "10", userID = "0", relevantClass = "1", labels = new List<string>() {"0", "1" } },
                new Issue() { ID = "1", title = "test_title", body = "test_body", type = "test_type", timespan = "20", userID = "0", relevantClass = "1", labels = new List<string>() {"0", "1" }  },
                new Issue() { ID = "2", title = "test_title2", body = "test_body2", type = "test_type2", timespan = "30", userID = "1", relevantClass = "1", labels = new List<string>() {"0", "1" }  }
            };

            columns = new List<Column>()
            {
                new Column() { ID = "0", issues = {"0"}, name = "test_column_1", order = 1, userID = "0"},
                new Column() { ID = "1", issues = {"2"}, name = "test_column_2", order = 1, userID = "1"}
            };
        }

        private async Task<ClientColumn> Populate(Column column)
        {
            ClientColumn client = new ClientColumn(column);
            foreach (var issueid in column.issues)
            {
                var issue = issues.Find(issue => issue.ID == issueid);
                if (issue == null) continue;
                var relevantClass = classes.Find(item => item.ID == issue.relevantClass);
                var clientIssue = new ClientIssue(issue);
                clientIssue.relevantClass = relevantClass;
                if (issue.labels != null)
                {
                    clientIssue.labels = labels.FindAll(item => issue.labels.Contains(item.ID));
                }
                client.issues.Add(clientIssue);
            }
            return client;
        }

        private async Task<List<ClientColumn>> PopulateList(List<Column> columns)
        {
            List<ClientColumn> clients = new List<ClientColumn>();
            foreach(var column in columns)
            {
                clients.Add(await Populate(column));
            }
            return clients;
        }

        public async Task<ClientColumn> AddColumn(string userID, ClientColumn column)
        {
            Column insert = column.Convert();
            insert.userID = userID;
            columns.Add(insert);
            return new ClientColumn(insert);
        }

        public async Task<ClientColumn> AddIssue(string userID, string columnid, string issueid)
        {
            var issue = issues.Find(issue => issue.ID == issueid && issue.userID == userID);
            if (issue == null) return null;
            var column = columns.Find(column => column.ID == columnid && column.userID == userID);
            if (column == null) return null;
            if (column.issues.Contains(issue.ID)) return null;
            column.issues.Add(issueid);
            columns.Insert(columns.IndexOf(columns.AsEnumerable()
                .FirstOrDefault(item =>item.ID == column.ID && column.userID == userID)
                ), column);

            return await Populate(column);
        }

        public async Task<ClientColumn> CreateIssueAndAdd(string userID, ClientIssue clientIssue, string columnid)
        {
            var issue = clientIssue.Convert();
            issue.userID = userID;
            issues.Add(issue);
            return await AddIssue(userID, columnid, issue.ID);
        }

        public async Task<string> DeleteColumn(string userID, string id)
        {
            columns.Remove(columns.Find(item => item.ID == id && item.userID == userID));
            return id;
        }

        public async Task<ClientColumn> GetColumn(string userID, string columnid)
        {
            var column = columns.Find(column => column.ID == columnid && column.userID == userID);
            return await Populate(column);
        }

        public async Task<List<ClientColumn>> GetColumns(string userID)
        {
            var columnsFound = columns.AsQueryable().Select(t => t).Where(column => column.userID == userID).ToList();
            return await PopulateList(columnsFound);
        }

        public async Task<string> MoveIssue(string userID, string originid, string destinationid, string issueid)
        {
            var originColumn = columns.Find(item => item.ID == originid && item.userID == userID);
            if (originColumn == null) return "Column " + originid + " not found.";

            var destinationColumn = columns.Find(item => item.ID == destinationid && item.userID == userID);
            if (destinationColumn == null) return "Column " + destinationid + " not found.";

            var issue = issues.Find(item => item.ID == issueid && item.userID == userID);
            if (issue == null) return "Issue " + issueid + " not found.";

            if (!originColumn.issues.Contains(issue.ID)) return "Origin column doesn't contain the specified issue.";

            originColumn.issues.Remove(issueid);
            destinationColumn.issues.Add(issueid);
            columns.Insert(columns.IndexOf(columns.AsEnumerable().FirstOrDefault(item => item.ID == originid && item.userID == userID)), originColumn);
            columns.Insert(columns.IndexOf(columns.AsEnumerable().FirstOrDefault(item => item.ID == destinationid && item.userID == userID)), destinationColumn);
            return "";
        }

        public async Task<string> RemoveIssue(string userID, string columnid, string issueid)
        {
            var column = columns.Find(item => item.ID == columnid && item.userID == userID);
            if (column == null) return "";

            if (!column.issues.Contains(issueid)) return "";
            column.issues.Remove(issueid);
            return issueid;
        }

        public async Task<ClientColumn> UpdateColumn(string userID, ClientColumn column)
        {
            Column update = column.Convert();
            columns.Insert(
                columns.IndexOf(
                columns.AsEnumerable().FirstOrDefault(item => item.ID == update.ID && item.userID == userID)
                ), update);
            return new ClientColumn(update);
        }
    }
}
