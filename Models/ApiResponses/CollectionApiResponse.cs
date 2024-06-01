using System;
using System.Text.Json.Serialization;

namespace TrendyChange.Models.ApiResponses
{
    public class CollectionApiResponse
    {
        [JsonPropertyName("meta")]
        public CollectionMetaData? Meta { get; set; }

        [JsonPropertyName("data")]
        public CollectionData? Data { get; set; }
    }

    public class CollectionMetaData
    {
        [JsonPropertyName("copyright")]
        public string? Copyright { get; set; }

        [JsonPropertyName("data_status")]
        public string? DataStatus { get; set; }
    }

    public class CollectionData
    {
        [JsonPropertyName("start")]
        public int? Start { get; set; }

        [JsonPropertyName("count")]
        public int? Count { get; set; }

        [JsonPropertyName("total")]
        public int? Total { get; set; }

        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [JsonPropertyName("quotes")]
        public List<Quote>? Quotes { get; set; }
    }

   
}


