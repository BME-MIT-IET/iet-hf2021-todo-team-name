using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deadline.DB;
using Deadline.Helpers;
using Deadline.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Deadline.API;
using Deadline.DB.IRepositories;

namespace Deadline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserRepository ur;
        public UserController(IUserRepository ur) => this.ur = ur;

        [HttpPost("authenticate")]
        public async Task<ActionResult> Authenticate(AuthenticateRequest model)
        {
            var response = await ur.Authenticate(model);
            if (response == null)
                return BadRequest("Email or password incorrect");

            return Ok(response);
        }
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await ur.Register(model);
            if (response == null)
                return BadRequest("User already exists");
            return Ok(response);
        }
        [HttpGet]
        public async Task<ActionResult<List<ClientUser>>> GetAll()
        {
            return ur.GetAll();
        }
    }
}