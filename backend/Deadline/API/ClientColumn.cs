using Deadline.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deadline.API
{
    public class ClientColumn
    {
        public ClientColumn(Column column)
        {
            ID = column.ID;
            name = column.name;
            order = column.order;
            issues = new List<ClientIssue>();
        }
        public Column Convert()
        {
            Column column = new Column();
            column.ID = ID;
            column.name = name;
            column.order = order;
            List<string> issueIDs = new List<string>();
            foreach (var issue in issues)
            {
                issueIDs.Add(issue.ID);
            }
            column.issues = issueIDs;
            return column;
        }
        public string ID { get; set; }
        public string name { get; set; }
        public int order { get; set; }
        public List<ClientIssue> issues { get; set; }
    }
}
