using Deadline.Entities;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deadline.DB
{
    public class ClassRepository
    {
        private readonly Database db;
        public ClassRepository(Database db) => this.db = db;
        
        public async Task<List<Class>> GetClasses(string id)
        {
            return await db.Classes.Find(c => c.userID == id).ToListAsync();
        }
        public async Task<Class> AddClass(string userID, Class newClass)
        {
            newClass.userID = userID;
            await db.Classes.InsertOneAsync(newClass);
            return newClass;
        }
        public async Task<Class> GetClass(string userID, string classID)
        {
            return await db.Classes.Find(c => c.userID == userID && c.ID == classID).FirstOrDefaultAsync();
        }
        public async Task<Class> UpdateClass(string userID, Class updated) 
        {
            return await db.Classes.FindOneAndReplaceAsync(c => c.ID == updated.ID && c.userID == userID, updated);
        }
        public async Task<Class> DeleteClass(string userID, string deleteID)
        {
            return await db.Classes.FindOneAndDeleteAsync(c => c.ID == deleteID && c.userID == userID);
        }
    }
}
