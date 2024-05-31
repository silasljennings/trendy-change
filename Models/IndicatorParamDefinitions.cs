using System;
namespace TrendyChange.Models
{
	public class IndicatorParamDefinitions
	{
        
        public List<string> BollingerBandFieldParams()
        {
            return new List<string>
            {
                CreateField("Unit", "number", "unit", "form-control"),
                CreateField("Deviation", "number", "deviation", "form-control")
            };
        }

        public List<string> SimpleMovingAverageFieldParams()
        {
            return new List<string>
            {
                CreateField("Unit", "number", "unit", "form-control")
            };
        }

        public List<string> ExponentialMovingAverage()
        {
            return new List<string>
            {
                CreateField("Unit", "number", "unit", "form-control")
            };
        }

        public List<string> KeltnerChannelsFieldParams()
        {
            return new List<string>
            {
                CreateField("Unit", "number", "unit", "form-control"),
                CreateField("ATR Multiplier", "number", "atrMultiplier", "form-control")
            };
        }

        private string CreateField(string labelText, string inputType, string id, string className)
        {
            return $"<label for=\"{id}\">{labelText}:</label><input type=\"{inputType}\" id=\"{id}\" class=\"{className}\" />";
        }
    }
}

