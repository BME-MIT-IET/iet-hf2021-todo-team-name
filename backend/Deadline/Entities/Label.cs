using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Deadline.Entities
{
    public class Label
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ID { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string userid { get; set; }
    }
}
