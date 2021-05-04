using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Deadline.Entities;
using MongoDB.Bson;
using MongoDB.Driver;
using Deadline.DB;
using System.Text.Json;
using Deadline.API;
using Microsoft.AspNetCore.Authorization;

namespace Deadline.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ColumnController : ControllerBase
    {
        private ColumnRepository cr;
        public ColumnController(ColumnRepository columnRepository)
        {
            cr = columnRepository;
        }
        [HttpGet]
        public async Task<ActionResult<List<ClientColumn>>> GetColumns()
        {
            return await cr.GetColumns(HttpContext.Items["UserID"].ToString());
        }
        public class NewIssueType { public string columnid { get; set; } public string issueid { get; set; } }
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpPost("addissue")]
        public async Task<ActionResult<ClientColumn>> AddIssue([FromBody] NewIssueType body)
        {
            /*var column = collection.Find(item => item.ID == body.columnid).FirstOrDefault();
            if (column == null) return BadRequest("Column " + body.columnid + " not found.");
            var issue = issueCollection.Find(item => item.ID == body.issueid).FirstOrDefault();
            if (issue == null) return BadRequest("Issue " + body.issueid + " not found.");
            column.issues.Add(issue.ID);
            collection.FindOneAndReplace(item => item.ID == column.ID, column);
            return column;*/
            var res = await cr.AddIssue(HttpContext.Items["UserID"].ToString(), body.columnid, body.issueid);
            if (res == null) return BadRequest();
            return res;
        }
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpPost("removeissue")]
        public async Task<ActionResult<string>> RemoveIssue([FromBody] NewIssueType body)
        {
            var res = await cr.RemoveIssue(HttpContext.Items["UserID"].ToString(), body.columnid, body.issueid);
            if (res == "") return BadRequest();
            return res;
        }
        public class MoveIssueType { public string origin { get; set; } public string destination { get; set; } public string issueid { get; set; } }
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpPost("moveissue")]
        public async Task<ActionResult> MoveIssue([FromBody] MoveIssueType body)
        {
            var res = await cr.MoveIssue(HttpContext.Items["UserID"].ToString(), body.origin, body.destination, body.issueid);
            if (res.Length > 0) return BadRequest(res);
            return Ok();
        }
        public class CreateAddType { public ClientIssue issue { get; set; } public string columnid { get; set; } }
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpPost("createandadd")]
        public async Task<ActionResult<ClientColumn>> CreateIssueAndAdd([FromBody] CreateAddType body)
        {
            /*var column = collection.Find(item => item.ID == body.columnid).FirstOrDefault();
            if (column == null) return BadRequest("Column " + body.columnid + " not found.");
            var issue = issueCollection.Find(item => item.ID == body.issueid).FirstOrDefault();
            if (issue == null) return BadRequest("Issue " + body.issueid + " not found.");
            column.issues.Add(issue.ID);
            collection.FindOneAndReplace(item => item.ID == column.ID, column);
            return column;*/
            var res = await cr.CreateIssueAndAdd(HttpContext.Items["UserID"].ToString(), body.issue, body.columnid);
            if (res == null) return BadRequest();
            return res;
        }

        [HttpPost]
        public async Task<ActionResult<ClientColumn>> AddColumn(ClientColumn column)
        {
            return await cr.AddColumn(HttpContext.Items["UserID"].ToString(), column);
        }
        [HttpGet("{columnid}")]
        public async Task<ClientColumn> GetColumn(string columnid)
        {
            return await cr.GetColumn(HttpContext.Items["UserID"].ToString(), columnid);
        }
        [HttpPut("{columnid}")]
        public async Task<ActionResult<ClientColumn>> UpdateClass(ClientColumn updated)
        {
            return await cr.UpdateColumn(HttpContext.Items["UserID"].ToString(), updated);
        }
        [HttpDelete("{columnid}")]
        public async Task<ActionResult<string>> DeleteClass(string columnid)
        {
            return await cr.DeleteColumn(HttpContext.Items["UserID"].ToString(), columnid);
        }
        
    }
}
