using Deadline.API;
using Deadline.Controllers;
using Deadline.DB.IRepositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using web_api_tests.FakeRepositories;
using Xunit;

namespace web_api_tests
{
    public class IssueControllerTest
    {
        IssueController controller;
        IIssueRepository repository;

        public IssueControllerTest()
        {
            //Arrange
            repository = new FakeIssueRepository();
            controller = new IssueController(repository)
            {
                ControllerContext = new ControllerContext()
            };
            controller.ControllerContext.HttpContext = new DefaultHttpContext();
            controller.ControllerContext.HttpContext.Items.Add("UserID", "0");
        }

        [Fact]
        public void Get_WhenCalled_ReturnsAllItems()
        {
            // Act
            var result = controller.GetIssues().Result;

            // Assert
            var items = Assert.IsType<List<ClientIssue>>(result.Value);
            Assert.Equal(2, items.Count);
        }
    }
}
