using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Deadline.Entities
{
    public class Workspace
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ID { get; set; }
        public string name { get; set; }
        public List<string> userIDs { get; set; }
        public List<string> columns { get; set; }
        public Workspace()
        {
            userIDs = new List<string>();
            columns = new List<string>();
        }
    }
}
