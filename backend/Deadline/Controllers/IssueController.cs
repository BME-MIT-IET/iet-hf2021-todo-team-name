using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Deadline.API;
using Microsoft.AspNetCore.Authorization;
using Deadline.DB.IRepositories;

namespace Deadline.Controllers
    {
        [Authorize]
        [Route("api/[controller]")]
        [ApiController]
        public class IssueController : ControllerBase
        {
            private readonly IIssueRepository ir;
            public IssueController(IIssueRepository ir)
            {
                this.ir = ir;
            }

            [HttpGet]
            public async Task<ActionResult<List<ClientIssue>>> GetIssues()
            {
                var classes = await ir.GetIssues(HttpContext.Items["UserID"].ToString());
                return classes;
            }
            [HttpPost]
            public async Task<ActionResult<ClientIssue>> AddIssue(ClientIssue newIssue)
            {
              return await ir.AddIssue(HttpContext.Items["UserID"].ToString(), newIssue);
            }

            [HttpGet("{issueid}")]
            public async Task<ActionResult<ClientIssue>> GetIssue(string issueid)
            {
                return await ir.GetIssue(HttpContext.Items["UserID"].ToString(), issueid);
            }

            [HttpPut("{issueid}")]
            public async Task<ActionResult<ClientIssue>> UpdateIssue(ClientIssue updated)
            {
                return await ir.UpdateIssue(HttpContext.Items["UserID"].ToString(), updated);
            }

            [HttpDelete("{issueid}")]
            public async Task<ActionResult<string>> DeleteClass(string issueid)
            {
                return await ir.DeleteIssue(HttpContext.Items["UserID"].ToString(), issueid);
            }
            [HttpGet("search/{query}")]
            public async Task<ActionResult<List<ClientIssue>>> Search(string query)
            {
                return await ir.Search(HttpContext.Items["UserID"].ToString(), query, HttpContext.RequestAborted);
            }
        }
    }
