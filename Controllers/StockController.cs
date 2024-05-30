using System;
using System.Net.Http;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using TrendyChange.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;


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
                Tickers = new List<string> { "AAPL", "MSFT", "GOOGL" },
                Intervals = new List<string> {"1d", "1wk", "1mo", "3mo" }
            };
            //"1m", "5m", "15m", "30m", "1h",

            return View(ViewModel);
        }

        [HttpGet]
        public async Task<IActionResult> GetChartData(string ticker, string interval)
        {
            var url = $"https://mboum.com/api/v1/hi/history/?symbol={ticker}&interval={interval}&diffandsplits=true&apikey=wncZL7dt7SWkcbJGvzo5DQTzfV6yHqUffOBjYIQhmvvPv8R6cqDieWOKuJW6";

            try
            {
                var apiResponse = await _httpClient.GetFromJsonAsync<HistoricalDataApiResponse>(url);
                if (apiResponse == null || apiResponse.HistoricalData == null || !apiResponse.HistoricalData.Any())
                {
                    return NotFound("Data not found");
                }

                var result = new
                {
                    meta = apiResponse.HistoricalMeta,
                    ohlcv = apiResponse.HistoricalData.Values.ToList()
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
                "Keltner Channels"
            };

            return Json(indicatorTypes);
        }
    }
}

public class HistoricalDataApiResponse
{
    [JsonPropertyName("data")]
    public Dictionary<string, HistoricalDataPoint>? HistoricalData { get; set; }

    [JsonPropertyName("meta")]
    public HistoricalMetaData? HistoricalMeta { get; set; }
}

public class HistoricalMetaData
{
    [JsonPropertyName("copyright")]
    public string? Copyright { get; set; }

    [JsonPropertyName("data_status")]
    public string? DataStatus { get; set; }

    [JsonPropertyName("currency")]
    public string? Currency { get; set; }

    [JsonPropertyName("symbol")]
    public string? Symbol { get; set; }

    [JsonPropertyName("exchangeName")]
    public string? ExchangeName { get; set; }

    [JsonPropertyName("fullExchangeName")]
    public string? FullExchangeName { get; set; }

    [JsonPropertyName("instrumentType")]
    public string? InstrumentType { get; set; }

    [JsonPropertyName("firstTradeDate")]
    public long? FirstTradeDate { get; set; }

    [JsonPropertyName("regularMarketTime")]
    public long? RegularMarketTime { get; set; }

    [JsonPropertyName("hasPrePostMarketData")]
    public bool? HasPrePostMarketData { get; set; }

    [JsonPropertyName("gmtoffset")]
    public int? GmtOffset { get; set; }

    [JsonPropertyName("timezone")]
    public string? Timezone { get; set; }

    [JsonPropertyName("exchangeTimezoneName")]
    public string? ExchangeTimezoneName { get; set; }

    [JsonPropertyName("regularMarketPrice")]
    public double? RegularMarketPrice { get; set; }

    [JsonPropertyName("fiftyTwoWeekHigh")]
    public double? FiftyTwoWeekHigh { get; set; }

    [JsonPropertyName("fiftyTwoWeekLow")]
    public double? FiftyTwoWeekLow { get; set; }

    [JsonPropertyName("regularMarketDayHigh")]
    public double? RegularMarketDayHigh { get; set; }

    [JsonPropertyName("regularMarketDayLow")]
    public double? RegularMarketDayLow { get; set; }

    [JsonPropertyName("regularMarketVolume")]
    public long? RegularMarketVolume { get; set; }

    [JsonPropertyName("chartPreviousClose")]
    public double? ChartPreviousClose { get; set; }

    [JsonPropertyName("priceHint")]
    public int? PriceHint { get; set; }

    [JsonPropertyName("dataGranularity")]
    public string? DataGranularity { get; set; }

    [JsonPropertyName("range")]
    public string? Range { get; set; }
}

public class HistoricalDataPoint
{
    [JsonPropertyName("date")]
    public string? Date { get; set; }

    [JsonPropertyName("date_utc")]
    public int? DateUtc { get; set; }

    [JsonPropertyName("open")]
    public double? Open { get; set; }

    [JsonPropertyName("high")]
    public double? High { get; set; }

    [JsonPropertyName("low")]
    public double? Low { get; set; }

    [JsonPropertyName("close")]
    public double? Close { get; set; }

    [JsonPropertyName("volume")]
    public int? Volume { get; set; }
}

public class StockViewModel
{
    public required List<string> Tickers { get; set; }
    public required List<string> Intervals { get; set; }
}