using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deadline.DB;
using Deadline.DB.IRepositories;
using Deadline.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Deadline.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LabelController : ControllerBase
    {
        private readonly ILabelRepository lr;
        public LabelController(ILabelRepository lr)
        {
            this.lr = lr;
        }
        [HttpGet]
        public async Task<ActionResult<List<Label>>> GetLabels()
        {
            return await lr.GetLabels(HttpContext.Items["UserID"].ToString());
        }
        [HttpPost]
        public async Task<ActionResult<Label>> AddLabel([FromBody] Label label)
        {
            var res =  await lr.AddLabel(label, HttpContext.Items["UserID"].ToString());
            if (res == null) return BadRequest("Label with same name already exists");
            return res;
        }
        [HttpDelete("{labelid}")]
        public async Task<ActionResult<string>> DeleteLabel(string labelid)
        {
            return await lr.Delete(labelid, HttpContext.Items["UserID"].ToString());
        }
    }
}
