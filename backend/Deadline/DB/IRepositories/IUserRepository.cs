using System.Collections.Generic;
using System.Threading.Tasks;
using Deadline.Entities;
using Deadline.Models;
using Deadline.API;

namespace Deadline.DB.IRepositories
{
    public interface IUserRepository
    {
        public Task<AuthenticateResponse> Authenticate(AuthenticateRequest model);
        public User FindById(string id);

        public List<ClientUser> GetAll();

        public Task<AuthenticateResponse> Register(RegisterRequest model);
    }
}
