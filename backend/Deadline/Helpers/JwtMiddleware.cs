
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Deadline.DB;
using Microsoft.AspNetCore.Builder;

namespace Deadline.Helpers
{
    public static class JwtMiddlewareExtensions
    {
        public static IApplicationBuilder UseJwtMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<JwtMiddleware>();
        }
    }
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        public JwtMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                    var id = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                    context.Items.Add("UserID", id);
            }
            catch (Exception)
            {
                // No user present
            }
            await _next(context);
        }
    //    public async Task Invoke(HttpContext context, UserRepository userRepository)
    //    {
    //        var token = context.Request.Headers["x-auth-token"].FirstOrDefault();
    //        if (token != null)
    //        {
    //            attachToUserContext(context, userRepository, token);
    //        }
    //        await _next(context);
    //    }

    //    private void attachToUserContext(HttpContext context, UserRepository userRepository, string token)
    //    {
    //        try
    //        {
    //            var tokenHandler = new JwtSecurityTokenHandler();
    //            var key = Encoding.ASCII.GetBytes("this is my custom Secret key for authnetication");
    //            tokenHandler.ValidateToken(token, new TokenValidationParameters
    //            {
    //                ValidateIssuerSigningKey = true,
    //                IssuerSigningKey = new SymmetricSecurityKey(key),
    //                ValidateIssuer = false,
    //                ValidateAudience = false,
    //                ClockSkew = TimeSpan.Zero
    //            }, out SecurityToken validatedToken);
    //            var jwtToken = (JwtSecurityToken)validatedToken;
    //            var userId = jwtToken.Claims.First(x => x.Type == "id").Value;

    //            context.Items["User"] = userRepository.FindById(userId);
    //        }
    //        catch
    //        {
    //        }
    //    }
    }
}
