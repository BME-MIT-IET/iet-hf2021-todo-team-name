using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Deadline.Entities;

namespace Deadline.API
{
    public class ClientIssue
    {
        public ClientIssue()
        {
            labels = new List<Label>();
        }
        public ClientIssue(Issue issue)
        {
            ID = issue.ID;
            title = issue.title;
            body = issue.body;
            type = issue.type;
            date = issue.date;
            timespan = issue.timespan;
            deadline = issue.deadline;
            start = issue.start;
            end = issue.end;
            labels = new List<Label>();
        }

        public Issue Convert()
        {
            Issue issue = new Issue();
            issue.ID = ID;
            issue.title = title;
            issue.body = body;
            issue.type = type;
            issue.date = date;
            issue.timespan = timespan;
            issue.deadline = deadline;
            issue.start = start;
            issue.end = end;
            if (relevantClass == null)
                issue.relevantClass = null;
            else
                issue.relevantClass = relevantClass.ID;
            if (labels != null)
            {
                issue.labels = labels.Select(label => label.ID).ToList();
            }
            return issue;
        }
        
        public string ID { get; set; }
        public string title { get; set; }
        public string body { get; set; }
        
        public Class relevantClass { get; set; }
        [RegularExpression("issue|event", ErrorMessage = "")]
        public string type { get; set; }
        public DateTime? date { get; set; }
        public DateTime? start { get; set; }
        public DateTime? end { get; set; }
        public string timespan { get; set; }
        public DateTime? deadline { get; set; }
        public List<Label>? labels { get; set; }
    }
}
