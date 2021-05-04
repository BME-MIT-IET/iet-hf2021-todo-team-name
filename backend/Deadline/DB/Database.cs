using Deadline.Entities;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deadline.DB
{
    public class Database
    {
        private static IMongoDatabase mongodb;
        public Database()
        {
            mongodb = new MongoClient("mongodb://localhost:27017").GetDatabase("deadline");
            Columns = mongodb.GetCollection<Column>("column");
            Issues = mongodb.GetCollection<Issue>("issue");
            Classes = mongodb.GetCollection<Class>("class");
            Users = mongodb.GetCollection<User>("user");
            Labels = mongodb.GetCollection<Label>("label");
            Workspaces = mongodb.GetCollection<Workspace>("workspace");
        }
        public IMongoCollection<Column> Columns { get; private set; }
        public IMongoCollection<Issue> Issues { get; private set; }
        public IMongoCollection<Class> Classes { get; private set; }
        public IMongoCollection<User> Users { get; private set; }
        public IMongoCollection<Label> Labels { get; private set; }
        public IMongoCollection<Workspace> Workspaces { get; private set; }
    }
}
