using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;
using Deadline.Entities;

namespace Deadline
{
    public static class Program
    {
        private static IMongoClient client;
        private static IMongoDatabase database;
        public static IMongoCollection<Class> classCollection;
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
            initalize();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        private static void initalize()
        {
            var pack = new ConventionPack
            {
                new ElementNameConvention(),
                new CamelCaseElementNameConvention(),
                new IgnoreIfDefaultConvention(true)
            };
            ConventionRegistry.Register("MyConventions", pack, _ => true);
            client = new MongoClient("mongodb://localhost:27017");
            database = client.GetDatabase("deadline");
            

            classCollection = database.GetCollection<Class>("class");


        }
    }
}
