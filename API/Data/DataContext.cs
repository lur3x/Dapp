using Microsoft.EntityFrameworkCore;
using API.Entities;

namespace API.Data;


public class DataContext : DbContext
{
	public DataContext(DbContextOptions options) : base(options) { }

	public DbSet<AppUser> Users {get; set;}

    internal async Task<bool> FindAsync(string username)
    {
        throw new NotImplementedException();
    }
}
