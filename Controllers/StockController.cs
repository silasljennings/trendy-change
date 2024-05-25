using System;
using Microsoft.AspNetCore.Mvc;

namespace TrendyChange.Controllers
{
    public class StockController : Controller
    {
        public IActionResult Index()
        {
            // List of stock tickers (you can fetch this from your database or any other source)
            var stockTickers = new List<string> { "AAPL", "MSFT", "GOOGL" };
            return View(stockTickers);
        }

        [HttpGet]
        public IActionResult GetChartData(string ticker)
        {
            // Here, you would call your external API to get stock data for the specified ticker
            // For simplicity, I'll just return some dummy data
            var labels = new List<string> { "Day 1", "Day 2", "Day 3", "Day 4", "Day 5" };
            var prices = new List<double> { 100, 110, 105, 115, 120 };
            var data = new { Labels = labels, Prices = prices };
            return new JsonResult(data);
        }
    }
}

