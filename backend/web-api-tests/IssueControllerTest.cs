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

        [Fact]
        public void GetById_ExistingIdPassed_ReturnsRightItem()
        {
            // Arrange
            var id = "0";

            // Act
            var result = controller.GetIssue(id).Result;

            // Assert
            Assert.IsType<ClientIssue>(result.Value);
            Assert.Equal(id, result.Value.ID);
        }

        [Fact]
        public void GetById_UnknownIdPassed_ReturnsNull()
        {
            // Act
            var result = controller.GetIssue("100").Result;

            // Assert
            Assert.Null(result.Value);
        }

        [Fact]
        public void Post_WhenCalled_AddsItem()
        {
            // Act
            _ = controller.AddIssue(new ClientIssue());

            // Assert
            var issues = controller.GetIssues().Result;
            var items = Assert.IsType<List<ClientIssue>>(issues.Value);
            Assert.Equal(3, items.Count);
        }

        [Fact]
        public void Put_ExistingIdPassed_ItemCountDoesntChange()
        {
            // Act
            _ = controller.UpdateIssue(new ClientIssue() { ID = "0" });

            // Assert
            var issues = controller.GetIssues().Result;
            var items = Assert.IsType<List<ClientIssue>>(issues.Value);
            Assert.Equal(2, items.Count);
        }

        [Fact]
        public void Put_ExistingIdPassed_UpdatesItem()
        {
            // Arrange
            var id = "0";
            var newIssue = new ClientIssue() { ID = id };

            // Act
            _ = controller.UpdateIssue(newIssue);

            // Assert
            var issue = controller.GetIssue(id).Result;
            var item = Assert.IsType<ClientIssue>(issue.Value);
            Assert.Equal(newIssue.title, item.title);
        }

        [Fact]
        public void Put_UnknownIdPassed_DoesntAddItem()
        {
            // Arrange
            var id = "100";
            var newIssue = new ClientIssue() { ID = id };

            // Act
            _ = controller.UpdateIssue(newIssue);

            // Assert
            var result = controller.GetIssue(id).Result;
            Assert.Null(result.Value);
        }

        [Fact]
        public void Delete_ExistingIdPassed_RemovesItem()
        {
            // Act
            _ = controller.DeleteIssue("0");

            // Assert
            var issues = controller.GetIssues().Result;
            var items = Assert.IsType<List<ClientIssue>>(issues.Value);
            Assert.Single(items);
        }

        [Fact]
        public void Delete_UnknownIdPassed_DoesntRemoveAnyItem()
        {
            // Act
            _ = controller.DeleteIssue("100");

            // Assert
            var issues = controller.GetIssues().Result;
            var items = Assert.IsType<List<ClientIssue>>(issues.Value);
            Assert.Equal(2, items.Count);
        }

        [Fact]
        public void GetSearch_ContainedStringPassed_ReturnsCorrectAmount()
        {
            // Act
            var result = controller.Search("iet").Result;

            // Assert
            Assert.Single(result.Value);
        }

        [Fact]
        public void GetSearch_NotContainedStringPassed_ReturnsCorrectAmount()
        {
            // Act
            var result = controller.Search("randomString").Result;

            // Assert
            Assert.Empty(result.Value);
        }
    }
}
