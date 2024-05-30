(function () {

    function bollingerBand(data, unit, deviation, type){
        var sma = simpleMovingAverage(data, unit)
        var sd = movingStandardDeviation(data, unit)

        if (type === "upper") {
            return sma.map((value, index) => value + (sd[index] * deviation));
        }

        if (type === "lower") {
            return sma.map((value, index) => value - (sd[index] * deviation));
        }

        throw new Error("Invalid type. Use 'upper' or 'lower'.");
    }

    function keltnerChannel(data, unit, atrMultiplier, type) {
        const ema = exponentialMovingAverage(data, unit);
        const atr = averageTrueRange(data.map(i => ({ high: i[3], low: i[2], close: i[4] })), unit);

        if (type === "middle") {
            return ema;
        }

        if (type === "upper") {
            return ema.map((value, index) => value + (atr[index] * atrMultiplier));
        }

        if (type === "lower") {
            return ema.map((value, index) => value - (atr[index] * atrMultiplier));
        }

        throw new Error("Invalid type. Use 'upper' or 'lower'.");
    }

    function simpleMovingAverage(data, unit){
        var sma = [];

        for (let i = 0; i <= data.length - unit; i++) {
            let sum = 0;
            for (let j = 0; j < unit; j++) {
                sum += data[i + j];
            }
            sma.push(sum / unit);
        }

        return sma;
    }

    function exponentialMovingAverage(data, unit) {
        emaArray = [];
        var closeData = data.map(i => i[7]);
        closeData.shift() // remove the headers
        emaArray.push(closeData[0]);
        var k = (2 / (parseInt(unit) + 1)).toFixed(3);
        for (var i = 1; i < closeData.length; i++) {
            var ema = (k * closeData[i]) + ((1 - k) * emaArray[i - 1]);
            emaArray.push(ema);
        }
        return emaArray;
    }

    function averageTrueRange(ohlc, unit) {
        let atr = [];
        let trueRanges = [];
        ohlc.shift(); // remove the headers

        for (let i = 1; i < ohlc.length; i++) {
            let high = ohlc[i].high;
            let low = ohlc[i].low;
            let prevClose = ohlc[i - 1].close;

            let tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
            trueRanges.push(tr);
        }

        // Calculate the initial ATR using SMA of the true ranges
        let initialATR = trueRanges.slice(0, unit).reduce((a, b) => a + b, 0) / unit;
        atr.push(initialATR);

        // Calculate subsequent ATR values
        for (let i = 1; i < trueRanges.length; i++) {
            let currentATR = ((atr[atr.length - 1] * (unit - 1)) + trueRanges[i]) / unit;
            atr.push(currentATR);
        }

        return atr;
    }

    function movingStandardDeviation(data, unit) {
        var sd = [];
        var sma = simpleMovingAverage(data, unit);

        for (let i = 0; i <= data.length - unit; i++) {
            let sum = 0;
            for (let j = 0; j < unit; j++) {
                sum += Math.pow(data[i + j] - sma[i], 2);
            }
            sd.push(Math.sqrt(sum / unit));
        }

        return sd;
    }

    function standardDeviation(data) {
        var mean = data.reduce((a, b) => a + b, 0) / data.length;
        var sqDiff = data.map(n => Math.pow(n - mean, 2));
        var avgSqDiff = sqDiff.reduce((a, b) => a + b, 0) / sqDiff.length;
        return Math.sqrt(avgSqDiff);
    }

    function applyIndicatorData(data, indicatorData) {
        var reversedData = data.slice().reverse();
        var reversedIndicatorData = indicatorData.slice().reverse();

        return reversedData.map((dataItem, index) => {
            const indicatorItem = reversedIndicatorData[index] || 0;
            return [...dataItem, indicatorItem];
        }).reverse();
    }

    function applyIndicator(data, indicator, params) {
        switch (indicator) {
            case "Bollinger Bands":
                var closeData = data.map(i => i[3]);
                var upperBand = bollingerBand(closeData, params.unit, params.deviation, "upper");
                var lowerBand = bollingerBand(closeData, params.unit, params.deviation, "lower");
                data = applyIndicatorData(data, upperBand);
                data = applyIndicatorData(data, lowerBand);
                data[0][data[0].length - 2] = "BBU-" + params.unit + '-' + params.deviation;
                data[0][data[0].length - 1] = "BBL-" + params.unit + '-' + params.deviation;
                return data;

            case "Simple Moving Average":
                var closeData = data.map(i => i[3]);
                var sma = simpleMovingAverage(closeData, params.unit);
                data = applyIndicatorData(data, sma);
                data[0][data[0].length - 1] = "SMA-" + params.unit;
                return data;

            case "Keltner Channels":
                var closeData = data.map(i => i[3]);
                var middleChannel = keltnerChannel(data, params.unit, params.atrMultiplier, "middle");
                var upperChannel = keltnerChannel(data, params.unit, params.atrMultiplier, "upper");
                var lowerChannel = keltnerChannel(data, params.unit, params.atrMultiplier, "lower");
                data = applyIndicatorData(data, middleChannel);
                data = applyIndicatorData(data, upperChannel);
                data = applyIndicatorData(data, lowerChannel);
                data[0][data[0].length - 3] = "KCM-" + params.unit + "-" + params.atrMultiplier;
                data[0][data[0].length - 2] = "KCU-" + params.unit + "-" + params.atrMultiplier;
                data[0][data[0].length - 1] = "KCL-" + params.unit + "-" + params.atrMultiplier;
                return data;

            default:
                return data;
        }
    }

    window.bollingerBand = bollingerBand;
    window.simpleMovingAverage = simpleMovingAverage;
    window.averageTrueRange = averageTrueRange;
    window.movingStandardDeviation = movingStandardDeviation;
    window.standardDeviation = standardDeviation;
    window.applyIndicatorData = applyIndicatorData;
    window.applyIndicator = applyIndicator;
    window.exponentialMovingAverage = exponentialMovingAverage;
    window.averageTrueRange = averageTrueRange;
})();
