using MongoDB.Bson;
using MongoDB;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;

namespace Deadline.Entities
{
    public class Issue
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ID { get; set; }
        public string title { get; set; }
        public string body { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string relevantClass { get; set; }
        [RegularExpression("issue|event", ErrorMessage = "")]
        public string type { get; set; }
        public DateTime? date { get; set; }
        public DateTime? start { get; set; }
        public DateTime? end { get; set; }
        public string timespan { get; set; }
        public DateTime? deadline { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string? userID { get; set; }

        public List<string>? labels { get; set; }

        public Issue()
        {
            date = null;
            deadline = null;
        }
    }
}
