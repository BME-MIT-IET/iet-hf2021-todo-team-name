using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Deadline.Entities;
using MongoDB.Bson;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authorization;
using Deadline.DB;

namespace Deadline.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        private readonly ClassRepository cr;
        private IMongoCollection<Class> collection;
        public ClassController(ClassRepository cr)
        {
            var client = new MongoClient("mongodb://localhost:27017");
            var db = client.GetDatabase("deadline");
            collection = db.GetCollection<Class>("class");
            this.cr = cr;
        }
        
        [HttpGet]
        public async Task<ActionResult<List<Class>>> GetClasses()
        {
            return await cr.GetClasses(HttpContext.Items["UserID"].ToString());
            var classes = collection.Find(classItem => true).ToList();
           
            return classes;
        }
        [HttpPost]
        public async Task<ActionResult<Class>> AddClass(Class newClass)
        {
            return await cr.AddClass(HttpContext.Items["UserID"].ToString(), newClass);
            /*var newClass = new Class
            {
                name = name,
                color = color,
                icon = icon
            };*/
            collection.InsertOne(newClass);
            return newClass;
        }
        [HttpGet("{classid}")]
        public async Task<ActionResult<Class>> GetClass(string classid)
        {
            return await cr.GetClass(HttpContext.Items["UserID"].ToString(), classid);
            var classItem = collection.Find(item => item.ID == classid).FirstOrDefault();
            return classItem;
        }
        [HttpPut("{classid}")]
        public async Task<ActionResult<Class>> UpdateClass(Class updated)
        {
            return await cr.UpdateClass(HttpContext.Items["UserID"].ToString(), updated);
            collection.FindOneAndReplace(item => item.ID == updated.ID, updated);
            return updated;
        }
        [HttpDelete("{classid}")]
        public async Task<ActionResult<Class>> DeleteClass(string classid)
        {
            return await cr.DeleteClass(HttpContext.Items["UserID"].ToString(), classid);
            var deleted = collection.FindOneAndDelete(item => item.ID == classid);
            return deleted;
        }
    }
}
