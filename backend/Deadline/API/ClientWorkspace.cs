using Deadline.Entities;
using System;
using System.Linq;
using System.Collections.Generic;

namespace Deadline.API
{
    public class ClientWorkspace
    {
        public ClientWorkspace(Workspace workspace)
        {
            ID = workspace.ID;
            name = workspace.name;
            columns = new List<ClientColumn>();
            users = new List<User>();
        }
        public Workspace Convert()
        {
            var workspace = new Workspace();
            workspace.ID = ID;
            workspace.name = name;
            workspace.userIDs = users.Select(item => item.ID).ToList();
            workspace.columns = columns.Select(item => item.ID).ToList();
            return workspace;
        }
        public string ID { get; set; }
        public List<ClientColumn> columns { get; set; }
        public List<User> users { get; set; }
        public string name { get; set; }
    }
}
