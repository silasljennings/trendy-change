using System;
using System.Net.Http;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using TrendyChange.Models.ApiResponses;
using TrendyChange.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using static System.Net.WebRequestMethods;
using System.Reflection.Metadata;
using System.Text.Json;
using TrendyChange.Routes;

namespace TrendyChange.Controllers
{
    public class StockController : Controller
    {

        private readonly HttpClient _httpClient;

        public StockController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public IActionResult Index()
        {
            // List of stock tickers (you can fetch this from your database or any other source)
            var ViewModel = new StockViewModel
            {
                Tickers = new List<string> {},
                Intervals = new List<string> {"1d", "1wk", "1mo", "3mo" }
            };
            //"1m", "5m", "15m", "30m", "1h",

            return View(ViewModel);
        }

        [HttpGet]
        public async Task<IActionResult> GetTickerList(string collection)
        {
            try
            {

                List<string> symbols = new List<string>();
                if (collection == "Most Watched")
                {
                    var url = $"https://mboum.com/api/v1/tr/trending?apikey=wncZL7dt7SWkcbJGvzo5DQTzfV6yHqUffOBjYIQhmvvPv8R6cqDieWOKuJW6";
                    var apiResponse = await _httpClient.GetStringAsync(url);

                    if (apiResponse == null)
                    {
                        return NotFound("Data not found");
                    }

                    using (JsonDocument document = JsonDocument.Parse(apiResponse))
                    {
                        JsonElement root = document.RootElement;
                        JsonElement quotes = root.GetProperty("data")[0].GetProperty("quotes");
                   
                        foreach (JsonElement symbol in quotes.EnumerateArray())
                        {
                            symbols.Add(symbol.GetString());
                        }
                    }

                    return new JsonResult(symbols);

                } else {
                    var url = $"https://mboum.com/api/v1/co/collections/?list={collection}&start=1&apikey=wncZL7dt7SWkcbJGvzo5DQTzfV6yHqUffOBjYIQhmvvPv8R6cqDieWOKuJW6";
                    var apiResponse = await _httpClient.GetFromJsonAsync<CollectionApiResponse>(url);

                    if (apiResponse == null || apiResponse.Data == null)
                    {
                        return NotFound("Data not found");
                    }
                    symbols = apiResponse.Data.Quotes?.Select(q => q.Symbol).ToList();
                    return new JsonResult(symbols);
                }
            }
            catch (HttpRequestException e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetChartData(string ticker, string interval)
        {
            var url = $"https://mboum.com/api/v1/hi/history/?symbol={ticker}&interval={interval}&diffandsplits=true&apikey=wncZL7dt7SWkcbJGvzo5DQTzfV6yHqUffOBjYIQhmvvPv8R6cqDieWOKuJW6";

            try
            {
                var apiResponse = await _httpClient.GetFromJsonAsync<HistoricalDataApiResponse>(url);
                if (apiResponse == null || apiResponse.Data == null || !apiResponse.Data.Any())
                {
                    return NotFound("Data not found");
                }

                var result = new
                {
                    meta = apiResponse.Meta,
                    ohlcv = apiResponse.Data.Values.ToList()
                };

                return new JsonResult(result);
            }
            catch (HttpRequestException e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetOptionsData(string ticker, string interval)
        {
            var url = $"https://mboum.com/api/v1/op/option/?symbol={ticker}&apikey=wncZL7dt7SWkcbJGvzo5DQTzfV6yHqUffOBjYIQhmvvPv8R6cqDieWOKuJW6";

            try
            {
                var apiResponse = await _httpClient.GetFromJsonAsync<OptionsApiResponse>(url);
                if (apiResponse == null || apiResponse.Data == null)
                {
                    return NotFound("Data not found");
                }

                var result = new
                {
                    meta = apiResponse.Meta,
                    data = apiResponse.Data
                };

                return new JsonResult(result);
            }
            catch (HttpRequestException e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }

        [HttpGet]
        public IActionResult GetIndicatorFieldParams(string indicatorType)
        {
            var indicatorParams = new IndicatorParamDefinitions();
            List<string> fieldParams;

            switch (indicatorType)
            {
                case "Bollinger Bands":
                    fieldParams = indicatorParams.BollingerBandFieldParams();
                    break;
                case "Simple Moving Average":
                    fieldParams = indicatorParams.SimpleMovingAverageFieldParams();
                    break;
                case "Exponential Moving Average":
                    fieldParams = indicatorParams.ExponentialMovingAverage();
                    break;
                case "Keltner Channels":
                    fieldParams = indicatorParams.KeltnerChannelsFieldParams();
                    break;
                default:
                    fieldParams = new List<string>();
                    break;
            }

            return Json(fieldParams);
        }

        public IActionResult GetAllIndicatorTypes()
        {
            var indicatorTypes = new List<string>
            {
                "Bollinger Bands",
                "Simple Moving Average",
                "Exponential Moving Average",
                "Keltner Channels"
            };

            return Json(indicatorTypes);
        }
    }
}

public class StockViewModel
{
    public required List<string> Tickers { get; set; }
    public required List<string> Intervals { get; set; }
}