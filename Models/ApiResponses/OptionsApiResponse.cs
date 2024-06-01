using System;
using System.Text.Json.Serialization;

namespace TrendyChange.Models.ApiResponses
{
    public class OptionsApiResponse
    {
        [JsonPropertyName("meta")]
        public CollectionMetaData? Meta { get; set; }

        [JsonPropertyName("data")]
        public CollectionData? Data { get; set; }
    }

    public class OptionsMetaData
    {
        [JsonPropertyName("copyright")]
        public string? Copyright { get; set; }

        [JsonPropertyName("data_status")]
        public string? DataStatus { get; set; }
    }

    public class OptionsData
    {
        public OptionChain? OptionChain { get; set; }
    }

    public class OptionChain
    {
        public List<OptionResult>? Result { get; set; }
        public string? Error { get; set; }
    }

    public class OptionResult
    {
        public string? UnderlyingSymbol { get; set; }
        public List<long>? ExpirationDates { get; set; }
        public List<double>? Strikes { get; set; }
        public bool? HasMiniOptions { get; set; }
        public Quote? Quote { get; set; }
        public List<Options>? Options { get; set; }
    }

    public class Options
    {
        public long ExpirationDate { get; set; }
        public bool HasMiniOptions { get; set; }
        public List<OptionContract>? Calls { get; set; }
        public List<OptionContract>? Puts { get; set; }
    }

    public class OptionContract
    {
        public RawFmtData? PercentChange { get; set; }
        public RawFmtLongFmtData? OpenInterest { get; set; }
        public RawFmtData? Strike { get; set; }
        public RawFmtData? Change { get; set; }
        public bool? InTheMoney { get; set; }
        public RawFmtData? ImpliedVolatility { get; set; }
        public RawFmtLongFmtData? Volume { get; set; }
        public RawFmtData? Ask { get; set; }
        public string? ContractSymbol { get; set; }
        public RawFmtLongFmtData? LastTradeDate { get; set; }
        public string? ContractSize { get; set; }
        public string? Currency { get; set; }
        public RawFmtLongFmtData? Expiration { get; set; }
        public RawFmtData? Bid { get; set; }
        public RawFmtData? LastPrice { get; set; }
    }


    public class RawFmtData
    {
        public double? Raw { get; set; }
        public string? Fmt { get; set; }
    }

    public class RawFmtLongFmtData
    {
        public int? Raw { get; set; }
        public string? Fmt { get; set; }
        public string? LongFmt { get; set; }
    }
}
