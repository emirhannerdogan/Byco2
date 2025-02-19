using Microsoft.EntityFrameworkCore;

namespace bycoAPI.Models
{
    public class DbContexts : DbContext
    {
        public DbContexts(DbContextOptions<DbContexts> options)
            : base(options)
        {

        }
        public DbSet<Siparis> Siparis { get; set; } = null!; //ok
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;//ok
        public DbSet<Category> Categories {get;set;} = null!;//ok
        public DbSet<SiarpisAra> SiparisAra { get; set; } = null!;
        public DbSet<Others> Others {get; set;} = null!;
    }
}
