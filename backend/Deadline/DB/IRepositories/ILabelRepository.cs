using Deadline.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Deadline.DB.IRepositories
{
    public interface ILabelRepository
    {
        public Task<List<Label>> GetLabels(string userid);
        public Task<Label> AddLabel(Label label, string userid);
        public Task<string> Delete(string labelid, string userid);
    }
}
