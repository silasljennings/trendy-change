(function () {

    function bollingerBand(data, columnDefinition) {
        var params = columnDefinition.split("-");
        var deviation = parseFloat(params[1]).toPrecision(3);
        var unit = parseInt(params[2]);
        var sma = simpleMovingAverage(data, "SMA-" + unit);
        var sd = movingStandardDeviation(data, "MSD-" + unit);

        if (columnDefinition.includes("BBU")) {
            return sma.map((value, index) => value + (sd[index] * deviation));
        }

        if (columnDefinition.includes("BBL")) {
            return sma.map((value, index) => value - (sd[index] * deviation));
        }

        throw new Error("Invalid type. Use 'upper' or 'lower'.");
    }

    function keltnerChannel(data, closeData, columnDefinition) {
        var params = columnDefinition.split("-");
        var atrMultiplier = parseFloat(params[1]).toPrecision(3);
        var unit = parseInt(params[2]);
        const ema = exponentialMovingAverage(closeData, "EMA-" + unit);
        const atr = averageTrueRange(data.map(i => ({ high: i[3], low: i[2], close: i[4] })), "ATR-" + unit);

        if (columnDefinition.includes("KCM")) {
            return ema;
        }

        if (columnDefinition.includes("KCU")) {
            return ema.map((value, index) => value + (atr[index] * atrMultiplier));
        }

        if (columnDefinition.includes("KCL")) {
            return ema.map((value, index) => value - (atr[index] * atrMultiplier));
        }

        throw new Error("Invalid type. Use 'upper' or 'lower'.");
    }

    function simpleMovingAverage(data, columnDefinition) {
        var params = columnDefinition.split("-");
        var unit = parseInt(params[1]);
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

    function exponentialMovingAverage(closeData, columnDefinition) {
        var params = columnDefinition.split("-");
        var unit = parseInt(params[1]);
        var emaArray = [];

        emaArray.push(closeData[0]);
        var k = (2 / (parseInt(unit) + 1)).toFixed(3);
        for (var i = 1; i < closeData.length; i++) {
            var ema = (k * closeData[i]) + ((1 - k) * emaArray[i - 1]);
            emaArray.push(ema);
        }
        return emaArray;
    }

    function averageTrueRange(ohlc, columnDefinition) {
        var params = columnDefinition.split("-");
        var unit = parseInt(params[1]);
        let atr = [];
        let trueRanges = [];

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

    function movingStandardDeviation(data, columnDefinition) {
        var params = columnDefinition.split("-");
        var unit = parseInt(params[1]);
        var sd = [];
        var sma = simpleMovingAverage(data, "SMA-" + unit);

        for (let i = 0; i <= data.length - unit; i++) {
            let sum = 0;
            for (let j = 0; j < unit; j++) {
                sum += Math.pow(data[i + j] - sma[i], 2);
            }
            sd.push(Math.sqrt(sum / unit));
        }

        return sd;
    }

    function calculateIndicatorData(data, indicatorData) {
        var reversedData = data.slice().reverse();
        var reversedIndicatorData = indicatorData.slice().reverse();

        return reversedData.map((dataItem, index) => {
            const indicatorItem = reversedIndicatorData[index] || 0;
            return [...dataItem, indicatorItem];
        }).reverse();
    }

    function getIndicatorData(data, closeData, columnDefinition) {
        var dataHeader = data.shift();
        var closeDataHeader = closeData.shift();

        if (columnDefinition.includes("BB")) {
            data = calculateIndicatorData(data, bollingerBand(closeData, columnDefinition));
        }
        else if (columnDefinition.includes("KC")) {
            data = calculateIndicatorData(data, keltnerChannel(data, closeData, columnDefinition));
        }
        else if (columnDefinition.includes("SMA")) {
            data = calculateIndicatorData(data, simpleMovingAverage(closeData, columnDefinition));
        }
        else if (columnDefinition.includes("EMA")) {
            data = calculateIndicatorData(data, exponentialMovingAverage(closeData, columnDefinition));
        } else {
            data = data;
        }

        var indicatorData = data.map(row => row[row.length - 1]);
        return indicatorData;
    }

    function getIndicatorColumnDefinition(params) {
        switch (params.indicator) {
            case "Bollinger Bands":
                var paramString = params.deviation + '-' + params.unit;
                return [
                    "BBU-" + paramString,
                    "BBL-" + paramString
                ];

            case "Keltner Channels":
                var paramString = params.atrMultiplier + "-" + params.unit;
                return [
                    "KCM-" + paramString,
                    "KCU-" + paramString,
                    "KCL-" + paramString
                ];

            case "Exponential Moving Average":
                var paramString = params.unit;
                return [
                    "EMA-" + paramString
                ];

            case "Simple Moving Average":
                var paramString = params.unit;
                return [
                    "SMA-" + paramString
                ];

            default:
                return [];
        }
    }

    // Expose the functions to the global scope
    window.getIndicatorData = getIndicatorData;
    window.getIndicatorColumnDefinition = getIndicatorColumnDefinition;

})();