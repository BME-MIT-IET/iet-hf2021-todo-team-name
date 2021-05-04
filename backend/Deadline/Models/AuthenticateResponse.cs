using Deadline.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deadline.Models
{
    public class AuthenticateResponse
    {
        public string token { get; set; }
        public UserType user { get; set; }
        public AuthenticateResponse(User user, string token)
        {
            this.user = new UserType();
            this.user.ID = user.ID;
            this.user.name = user.Name;
            this.user.email = user.Email;
            this.token = token;
        }
    }
    public class UserType
    {
        public string ID { get; set; }
        public string name { get; set; }
        public string email { get; set; }
    }
}
