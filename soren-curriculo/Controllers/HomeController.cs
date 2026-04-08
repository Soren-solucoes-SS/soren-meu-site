using Microsoft.AspNetCore.Mvc;

namespace soren_curriculo.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            ViewBag.Mensagem = "Bem vindo ao meu site, me chamo Deivid";
            return View();
        }

        [HttpGet("/videos")]
        public IActionResult Videos()
        {
            // Página dedicada para exibir vídeos do portfólio0033
            return View();
        }

    }
}
