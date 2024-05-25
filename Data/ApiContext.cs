using Microsoft.EntityFrameworkCore;
using TrendyChange.Models;

namespace TrendyChange.Data {
	
	public class ApiContext : DbContext {
      
        public ApiContext(DbContextOptions<ApiContext> options): base(options) {
		
	}

        public DbSet<User> Users { get; set; }

    }
}

