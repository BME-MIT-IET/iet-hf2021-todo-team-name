using Deadline.Controllers;
using Deadline.DB.IRepositories;
using Deadline.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using web_api_tests.FakeRepositories;
using Xunit;

namespace web_api_tests
{
    public class LabelControllerTest
    {
        LabelController controller;
        ILabelRepository repository;

        public LabelControllerTest()
        {
            //Arrange
            repository = new FakeLabelRepository();
            controller = new LabelController(repository);

            controller.ControllerContext = new ControllerContext();
            controller.ControllerContext.HttpContext = new DefaultHttpContext();
            controller.ControllerContext.HttpContext.Items.Add("UserID", "0");
        }

        [Fact]
        public void Get_WhenCalled_ReturnsAllItems()
        {
            // Act
            var result = controller.GetLabels().Result;

            // Assert
            var items = Assert.IsType<List<Label>>(result.Value);
            Assert.Equal(2, items.Count);
        }

        [Fact]
        public void Delete_ExistingIdPassed_RemovesItem()
        {
            // Act
            var labelId = controller.DeleteLabel("1").Result;

            // Assert
            var result = controller.GetLabels().Result;
            var items = Assert.IsType<List<Label>>(result.Value);
            Assert.Single(items);
        }

        [Fact]
        public void Delete_NotExistingIdPassed_DoesntRemoveAnyItem()
        {
            // Act
            var labelId = controller.DeleteLabel("100").Result;

            // Assert
            var result = controller.GetLabels().Result;
            var items = Assert.IsType<List<Label>>(result.Value);
            Assert.Equal(2, items.Count);
        }

        [Fact]
        public void Post_NotExistingNamePassed_AddsItem()
        {
            // Act
            var labelId = controller.AddLabel(
                new Label() { name = "AddLabelTest", type = "test_type", userid = "0"  }
                ).Result;

            // Assert
            var result = controller.GetLabels().Result;
            var items = Assert.IsType<List<Label>>(result.Value);
            Assert.Equal(3, items.Count);
        }

        [Fact]
        public void Post_ExistingNamePassed_DoesntAddItem()
        {
            // Act
            var labelId = controller.AddLabel(
                new Label() { name = "test_name", type = "test_type", userid = "0" }
                ).Result;

            // Assert
            var result = controller.GetLabels().Result;
            var items = Assert.IsType<List<Label>>(result.Value);
            Assert.Equal(2, items.Count);
        }
    }
}
