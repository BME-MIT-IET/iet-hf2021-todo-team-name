using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deadline.API;
using Deadline.DB;
using Deadline.DB.IRepositories;
using Deadline.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Deadline.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class WorkspaceController : ControllerBase
    {
        private IWorkspaceRepository wr;
        public WorkspaceController(IWorkspaceRepository wr) => this.wr = wr;
        [HttpPost]
        public async Task<ActionResult<ClientWorkspace>> Create([FromBody] string name)
        {
            return await wr.Create(name, HttpContext.Items["UserID"].ToString());
        }
        [HttpPost("{id}/userchange")]
        public async Task<ActionResult<ClientWorkspace>> ChangeUsers(string id, [FromBody] List<string> userIDs)
        {
            return await wr.ChangeUsers(id, userIDs);
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<ClientWorkspace>> GetWorkspace(string id)
        {
            return await wr.GetWorkspace(id);
        }

        [HttpPost("adduser/{id}")]
        public async Task<ActionResult<ClientWorkspace>> AddUser(string id, [FromBody] string userID)
        {
            return await wr.AddUser(id, userID);
        }
        [HttpGet]
        public async Task<ActionResult<List<ClientWorkspace>>> GetAll()
        {
            return await wr.GetAll(HttpContext.Items["UserID"].ToString());
        }
    }
}
