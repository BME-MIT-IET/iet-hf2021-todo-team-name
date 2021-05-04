using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Deadline.Entities;

namespace Deadline.API
{
    public class ClientUser
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ID { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public ClientUser(User user)
        {
            ID = user.ID;
            Email = user.Email;
            Name = user.Name;
        }
    }
}
