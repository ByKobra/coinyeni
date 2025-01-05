using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Telegram.Bot;
using Telegram.Bot.Types;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext'i singleton yapıyoruz
builder.Services.AddSingleton<AppDbContext>(provider => {
    var options = new DbContextOptionsBuilder<AppDbContext>()
        .UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
        .Options;
    return new AppDbContext(options);
});

// UserService'i singleton yapıyoruz
builder.Services.AddSingleton<IUserService, UserService>();

// Bot servisini ekle
builder.Services.AddSingleton<Bot>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    
    // Geliştirme için HTTPS'i devre dışı bırak
    // app.UseHttpsRedirection();
}
else 
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles(); // wwwroot klasöründeki HTML dosyası için
app.UseAuthorization();
app.MapControllers();

// Anasayfayı adwatch.html'e yönlendir
app.MapGet("/", async context =>
{
    context.Response.Redirect("/adwatch.html");
});

// Bot'u başlat
var bot = app.Services.GetRequiredService<Bot>();
var cts = new CancellationTokenSource();

var receiverOptions = new ReceiverOptions
{
    AllowedUpdates = Array.Empty<UpdateType>()
};

app.Lifetime.ApplicationStarted.Register(() =>
{
    var botClient = new TelegramBotClient(builder.Configuration["TelegramBot:Token"]);
    botClient.StartReceiving(
        bot.HandleUpdateAsync,
        bot.HandlePollingErrorAsync,
        receiverOptions,
        cts.Token
    );
});

app.Lifetime.ApplicationStopping.Register(() => cts.Cancel());

app.Run(); 