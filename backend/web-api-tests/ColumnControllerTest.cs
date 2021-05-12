using Deadline.Controllers;
using Deadline.DB.IRepositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using web_api_tests.FakeRepositories;
using Xunit;
using Deadline.API;

namespace web_api_tests
{
    public class ColumnControllerTest
    {
        private ColumnController controller;
        private IColumnRepository repository;

        public ColumnControllerTest()
        {
            // Arrange
            repository = new FakeColumnRepository();
            controller = new ColumnController(repository)
            {
                ControllerContext = new ControllerContext()
            };
            controller.ControllerContext.HttpContext = new DefaultHttpContext();
            controller.ControllerContext.HttpContext.Items.Add("UserID", "0");
        }

        [Fact]
        public async void GetColumns_ReturnsColumns()
        {
            // Act
            var result = controller.GetColumns().Result.Value;

            // Assert
            Assert.NotEmpty(result);
        }

        [Fact]
        public async void GetColumns_ReturnsEmpty()
        {
            // Act
            controller.ControllerContext.HttpContext.Items.Clear();
            controller.ControllerContext.HttpContext.Items.Add("UserID", "2222");
            var result = controller.GetColumns().Result.Value;

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public async void AddIssue_WhenCalled_Returns()
        {
            // Act
            var body = new ColumnController.NewIssueType()
            {
                columnid = "0",
                issueid = "0"
            };
            var result = controller.AddIssue(body);

            // Assert
            Assert.IsType<Task<ActionResult<ClientColumn>>>(result);
        }

        [Fact]
        public async void AddIssue_AddsItem()
        {
            // Act
            var lengthBefore = controller.GetColumns().Result.Value.Count;
            var body = new ColumnController.NewIssueType()
            {
                columnid = "0",
                issueid = "0"
            };
            await controller.AddIssue(body);
            var lengthAfter = controller.GetColumns().Result.Value.Count;

            // Assert
            Assert.Equal(lengthBefore, lengthAfter);
        }

        [Fact]
        public async void RemoveIssue_RemovesItem()
        {
            // Act
            var lengthBefore = controller.GetColumns().Result.Value.Count;
            var body = new ColumnController.NewIssueType()
            {
                columnid = "0",
                issueid = "0"
            };
            await controller.AddIssue(body);
            await controller.RemoveIssue(body);

            var lengthAfter = controller.GetColumns().Result.Value.Count;

            // Assert
            Assert.Equal(lengthBefore, lengthAfter);
        }
    }
}
