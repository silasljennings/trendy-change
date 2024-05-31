using System;
using System.Text.Json.Serialization;

namespace TrendyChange.Models.ApiResponses
{
	
    public class HistoricalDataApiResponse
    {

        [JsonPropertyName("meta")]
        public HistoricalMetaData? Meta { get; set; }

        [JsonPropertyName("data")]
        public Dictionary<string, HistoricalData>? Data { get; set; }
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

    public class HistoricalData
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

}

