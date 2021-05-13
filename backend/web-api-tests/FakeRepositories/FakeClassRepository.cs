using Deadline.DB.IRepositories;
using Deadline.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace web_api_tests.FakeRepositories
{
    class FakeClassRepository : IClassRepository
    {
        private List<Class> classes;

        public FakeClassRepository()
        {
            classes = new List<Class>()
            {
                new Class() {ID = "1", color = "green", icon = "important", name="iet", userID = "0"},
                new Class() {ID = "2", color = "red", icon = "important", name="kliens", userID = "1"},
                new Class() {ID = "3", color = "red", icon = "important", name="kliens", userID = "2"},
                new Class() {ID = "4", color = "red", icon = "important", name="kliens", userID = "3"},
                new Class() {ID = "5", color = "green", icon = "finished", name="kliens", userID = "0"},
                new Class() {ID = "6", color = "yellow", icon = "line", name="it_biztonsag", userID = "1"}
            };
        }

        public async Task<Class> AddClass(string userID, Class newClass)
        {
            newClass.userID = userID;
            classes.Add(newClass);
            return newClass;
        }

        public async Task<Class> DeleteClass(string userID, string deleteID)
        {
            //if it cant find the record, it should throw an exception, but im sticking to the implementation
            var record = classes.Find(t => t.ID == deleteID && t.userID == userID);

            if(record != null)
            {
                classes.Remove(record);

                return record;
            }
            else
            {
                return null;
            }

            
        }

        public async Task<Class> GetClass(string userID, string classID)
        {
            return classes.AsQueryable().FirstOrDefault(c => c.userID == userID && c.ID == classID);
        }

        public async Task<List<Class>> GetClasses(string id)
        {
            return classes.AsQueryable().Select(c => c).Where(c => c.userID == id).ToList();
        }

        public async Task<Class> UpdateClass(string userID, Class updated)
        {
            var index = classes.FindIndex(c => c.ID == updated.ID && c.userID == userID);
            if (index != -1)
            {
                classes[index] = updated;

                return updated;
            }
            else
            {
                return null;
            }
        }
    }
}
