using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Deadline.Entities
{
    public class Class
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ID { get; set; }
        public string name { get; set; }
        public string color { get; set; }
        public string icon { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string? userID { get; set; }
        public Class()
        {

        }
    }
}
