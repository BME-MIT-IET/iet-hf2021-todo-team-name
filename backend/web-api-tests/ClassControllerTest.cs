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
using Deadline.Entities;

namespace web_api_tests
{
    public class ClassControllerTest
    {
        // some of these tests would have more meaning if we injected a service that contains logic,
        // rather than a fake repository, this way we only test the controller

        private ClassController controller;
        private IClassRepository repository;

        public ClassControllerTest()
        {
            //Arrange
            repository = new FakeClassRepository();
            controller = new ClassController(repository)
            {
                ControllerContext = new ControllerContext()
            };
            controller.ControllerContext.HttpContext = new DefaultHttpContext();
            controller.ControllerContext.HttpContext.Items.Add("UserID", "0");
        }

        [Fact]
        public async void Add_AddsItem_ReturnsItem()
        {
            // Act
            var toAdd = new Class() { ID = "10", color = "red", icon = "AUT", name = "onlab", userID = "0" };
            var result = await controller.AddClass(toAdd);

            // Assert
            Assert.IsType<Class>(result.Value);
            Assert.Equal(toAdd, result.Value);
        }

        [Fact]
        public async void Add_AddsItem_ListExpands()
        {
            // Act
            var lengthBefore = repository.GetClasses("0").Result.Count;
            var toAdd = new Class() { ID = "10", color = "red", icon = "AUT", name = "onlab", userID = "0" };
            await controller.AddClass(toAdd);

            // Assert
            var lengthAfter = repository.GetClasses("0").Result.Count;
            Assert.Equal(lengthBefore + 1, lengthAfter);
        }

        [Fact]
        public async void Add_WithUserThatDoesntExist_ShouldThrowErrorl()
        {
            // Act
            var toAdd = new Class() { ID = "10", color = "red", icon = "AUT", name = "onlab", userID = "120" };


            // Assert
            await Assert.ThrowsAsync<ArgumentException>(async () => await controller.AddClass(toAdd));
        }

        // this equal is bugged, they are the same and still it fails
        [Fact]
        public async void Delete_Deletes_Existing_AndReturnsDeleted()
        {
            // Act
            var toRemove = new Class() { ID = "1", color = "green", icon = "important", name = "iet", userID = "0" };
            var result = await controller.DeleteClass(toRemove.ID);

            // Assert
            Assert.Equal(toRemove, result.Value);
        }

        [Fact]
        public async void Delete_Removes_Item()
        {
            // Act
            var toRemove = new Class() { ID = "1", color = "green", icon = "important", name = "iet", userID = "0" };
            var lengthBefore = controller.GetClasses().Result.Value.Count;
            await controller.DeleteClass(toRemove.ID);

            // Assert
            var lengthAfter = controller.GetClasses().Result.Value.Count;
            Assert.Equal(lengthBefore - 1, lengthAfter);

        }

        [Fact]
        public async void Delete_With_Non_Existing_User_DoesntRemove()
        {
            // Act
            controller.ControllerContext.HttpContext.Items.Remove("UserID");
            controller.ControllerContext.HttpContext.Items.Add("UserID", "10");
            var toRemove = new Class() { ID = "1", color = "green", icon = "important", name = "iet", userID = "0" };
            var lengthBefore = controller.GetClasses().Result.Value.Count;
            await controller.DeleteClass(toRemove.ID);

            // Assert
            var lengthAfter = controller.GetClasses().Result.Value.Count;
            Assert.Equal(lengthBefore, lengthAfter);
        }

        [Fact]
        public async void Delete_With_Non_Existing_User_ReturnsNull()
        {
            // Act
            controller.ControllerContext.HttpContext.Items.Remove("UserID");
            controller.ControllerContext.HttpContext.Items.Add("UserID", "10");
            var toRemove = new Class() { ID = "1", color = "green", icon = "important", name = "iet", userID = "0" };
            
            var result = await controller.DeleteClass(toRemove.ID);

            // Assert
            Assert.Null(result.Value);
        }

        [Fact]
        public async void Delete_With_Non_Existing_Class_DoesntRemove()
        {
            // Act
            var toRemove = new Class() { ID = "111", color = "green", icon = "important", name = "iet", userID = "0" };
            var lengthBefore = controller.GetClasses().Result.Value.Count;
            await controller.DeleteClass(toRemove.ID);

            // Assert
            var lengthAfter = controller.GetClasses().Result.Value.Count;
            Assert.Equal(lengthBefore, lengthAfter);
        }

        [Fact]
        public async void Delete_With_Non_Existing_Class_ReturnNull()
        {
            // Act
            var toRemove = new Class() { ID = "1111", color = "green", icon = "important", name = "iet", userID = "0" };
            var result = await controller.DeleteClass(toRemove.ID);

            // Assert
            Assert.Null(result.Value);
        }

        // this works as well but buggy because of shallow copying?
        [Fact]
        public async void GetClass_ReturnsClass()
        {
            // Act
            var toGet = new Class() { ID = "1", color = "green", icon = "important", name = "iet", userID = "0" };
            var result = await controller.GetClass("1");

            // Assert
            Assert.Equal(toGet, result.Value);
        }

        [Fact]
        public async void GetClass_WithWrongUser_ReturnsNull()
        {
            // Act
            controller.ControllerContext.HttpContext.Items.Remove("UserID");
            controller.ControllerContext.HttpContext.Items.Add("UserID", "2");

            var result = await controller.GetClass("1");

            // Assert
            Assert.Null(result.Value);

        }

        [Fact]
        public async void GetClass_With_NonExistingClass_ReturnsNull()
        {
            // Act
            
            var result = await controller.GetClass("1111");

            // Assert
            Assert.Null(result.Value);
        }

        // we have to throw an exception, as accessing a certain class without having permission
        // could be dangerous
        [Fact]
        public async void GetClass_WithNonExistingUser_ThrowsException()
        {
            // Act
            controller.ControllerContext.HttpContext.Items.Remove("UserID");
            controller.ControllerContext.HttpContext.Items.Add("UserID", "2");

            var result = await controller.GetClass("1");

            // Assert
            await Assert.ThrowsAsync<ArgumentException>(async () => await controller.GetClass("1"));
        }

        [Fact]
        public async void GetClasses_ReturnsCorrectClasses()
        {
            // Act
            var result = await controller.GetClasses();
            

            // Assert
            Assert.All(result.Value, t => t.userID.Equals("0"));
        }

        // doesnt need to throw an error when called with a user that doesn't exist, because we return an empty list,
        // and so, it isnt dangerous
        [Fact]
        public async void GetClasses_WithUserThatHasNoClasses_ReturnsEmpty()
        {
            // Act
            controller.ControllerContext.HttpContext.Items.Remove("UserID");
            controller.ControllerContext.HttpContext.Items.Add("UserID", "2");

            var result = await controller.GetClasses();

            // Assert
            Assert.Empty(result.Value);
        }

        [Fact]
        public async void Update_UpdatesItem()
        {
            // Act
            var toUpdate = new Class() { ID = "1", color = "red", icon = "important", name = "iet", userID = "0" };
            var result = await controller.UpdateClass(toUpdate);

            // Assert
            Assert.Equal(toUpdate, result.Value);
        }

        [Fact]
        public async void Update_WithNonExistingItem_ReturnsNull()
        {
            // Act
            var toUpdate = new Class() { ID = "111", color = "red", icon = "important", name = "iet", userID = "0" };
            var result = await controller.UpdateClass(toUpdate);

            // Assert
            Assert.Null(result.Value);
        }

        // This should throw an exception, as updating without permission is dangerous
        [Fact]
        public async void Update_WithNonExistingUser_ThrowsException()
        {
            // Act
            controller.ControllerContext.HttpContext.Items.Remove("UserID");
            controller.ControllerContext.HttpContext.Items.Add("UserID", "22");

            var toUpdate = new Class() { ID = "1", color = "red", icon = "important", name = "iet", userID = "0" };
            var result = await controller.UpdateClass(toUpdate);

            // Assert
            await Assert.ThrowsAsync<ArgumentException>(async () => await controller.UpdateClass(toUpdate));
        }
    }
}
