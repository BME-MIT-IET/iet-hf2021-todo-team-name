using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Deadline.Entities;
using System.Text;
using System.Security.Claims;
using Deadline.Models;
using System.Security.Cryptography;
using Deadline.API;
using Microsoft.Extensions.Configuration;

namespace Deadline.DB
{
    public class UserRepository
    {
        private Database db;
        IConfiguration config;
        public UserRepository(Database db, IConfiguration config) { 
            this.db = db;
            this.config = config;
        }

        public async Task<AuthenticateResponse> Authenticate(AuthenticateRequest model)
        {
            var user = await db.Users.Find(item => item.Email == model.email).FirstOrDefaultAsync();
            if (user == null) return null;
            if (!VerifyPassword(model.password, user.PasswordHash, user.PasswordSalt)) return null;

            return new AuthenticateResponse(user, GenerateJwtToken(user));
        }
        public User FindById(string id)
        {
            return db.Users.Find(item => item.ID == id).FirstOrDefault();
        }

        public List<ClientUser> GetAll()
        {
            var users =  db.Users.Find(item => true).ToList();
            var result = new List<ClientUser>();
            foreach (var user in users)
            {
                result.Add(new ClientUser(user));
            }
            return result;
        }

        public async Task<AuthenticateResponse> Register(RegisterRequest model)
        {
            var user = await db.Users.Find(item => item.Email == model.Email).FirstOrDefaultAsync();
            if (user != null) return null;


            var newUser = new User
            {
                Name = model.Name,
                Email = model.Email,
                Password = model.Password
            };
            CreatePasswordHash(model.Password, newUser);
            await db.Users.InsertOneAsync(newUser);

            return new AuthenticateResponse(newUser, GenerateJwtToken(newUser));
        }

        private void CreatePasswordHash(string password, User user)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                user.PasswordSalt = hmac.Key;
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPassword(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)); // Create hash using password salt.
                for (int i = 0; i < computedHash.Length; i++)
                { // Loop through the byte array
                    if (computedHash[i] != passwordHash[i]) return false; // if mismatch
                }
            }
            return true; //if no mismatches.
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(config.GetSection("AppSettings:Token").Value);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, user.ID), new Claim(ClaimTypes.Name, user.Name), new Claim(ClaimTypes.Email, user.Email) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)

            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
