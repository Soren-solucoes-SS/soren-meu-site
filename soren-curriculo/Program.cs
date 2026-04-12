var builder = WebApplication.CreateBuilder(args);

// MVC (controllers + views)
builder.Services.AddControllersWithViews();

var app = builder.Build();

// arquivos estáticos (wwwroot/css, wwwroot/js, imagens, etc.)
app.UseStaticFiles();

app.UseRouting();

// Se tiver autenticação/autorização, deixe aqui:
// app.UseAuthentication();
// app.UseAuthorization();

// Rota padrão -> Home/Index
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
