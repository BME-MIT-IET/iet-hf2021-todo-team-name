using Deadline.DB.IRepositories;
using Deadline.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace web_api_tests.FakeRepositories
{
    class FakeLabelRepository : ILabelRepository
    {
        private readonly List<Label> labels;

        public FakeLabelRepository()
        {
            labels = new List<Label>()
            {
                new Label() { ID = "0", name = "iet_name", type = "iet_type", userid = "0" },
                new Label() { ID = "1", name = "test_name", type = "test_type", userid = "0" },
                new Label() { ID = "2", name = "test_name2", type = "test_type2", userid = "1" },
            };
        }

        public async Task<Label> AddLabel(Label label, string userid)
        {
            var labelExisting = labels.FirstOrDefault(item => item.name == label.name);
            if (labelExisting != null)
                return null;

            label.ID = Guid.NewGuid().ToString();
            label.userid = userid;
            labels.Add(label);
            return label;
        }

        public async Task<string> Delete(string labelid, string userid)
        {
            var existing = labels.FirstOrDefault(l => l.ID == labelid && l.userid == userid);

            if (existing == null)
                return "-1";

            labels.Remove(existing);
            return labelid;
        }

        public async Task<List<Label>> GetLabels(string userid)
        {
            return labels.FindAll(l => l.userid == userid).ToList();
        }
    }
}
