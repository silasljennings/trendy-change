using System;
namespace TrendyChange.Routes
{
	public class Routes
	{
        public static void ConfigureRoutes(IEndpointRouteBuilder endpoints)
        {
            endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller=Users}/{action=Index}/{id?}");
        }
    }
}

