using Deadline.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using Deadline.DB.IRepositories;

namespace Deadline.DB
{
    public class LabelRepository : ILabelRepository
    {
        private readonly Database db;
        public LabelRepository(Database db) => this.db = db;

        public async Task<List<Label>> GetLabels(string userid)
        {
            return await db.Labels.Find(item => item.userid == userid).ToListAsync();
        }
        public async Task<Label> AddLabel(Label label, string userid)
        {
            label.userid = userid;
            var labelExisting = await db.Labels.Find(item => item.name == label.name).FirstOrDefaultAsync();
            if (labelExisting != null) return null;
            await db.Labels.InsertOneAsync(label);
            return label;
        }
        public async Task<string> Delete(string labelid, string userid)
        {
            await db.Labels.DeleteOneAsync(item => item.userid == userid && item.ID == labelid);
            return labelid;
        }
    }
}
