using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System.Security.Policy;

namespace Deadline.Entities
{
    public class Column
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ID { get; set; }
        public string name { get; set; }
        public int order { get; set; }
        public List<string> issues { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string? userID { get; set; }
        public Column()
        {
            issues = new List<string>();
        }
    }
}
