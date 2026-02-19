using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TournoiAPI.Data;
using TournoiAPI.Repositories.Implementations;
using TournoiAPI.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Configurer CORS pour permettre les requêtes cross-origin
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader());
});

// Add services to the container.
builder.Services.AddControllers();

// Add DbContext
builder.Services.AddDbContext<TournoiDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add repositories
builder.Services.AddScoped<ITournoiRepository, TournoiRepository>();
builder.Services.AddScoped<IEquipeRepository, EquipeRepository>();
builder.Services.AddScoped<IMatchRepository, MatchRepository>();
builder.Services.AddScoped<IClassementRepository, ClassementRepository>();

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Tournoi API",
        Version = "v1",
        Description = "API pour la gestion des tournois sportifs"
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Tournoi API v1"));
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

// Utiliser CORS avant d'autres middlewares qui utilisent l'authentification
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// Créer et appliquer les migrations automatiquement en développement
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<TournoiDbContext>();
    }
}

app.Run();