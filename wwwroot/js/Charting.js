(function () {

    function getCandlestickData(ohlcv) {
        var candlestickData = [[{ type: 'date', label: 'Date' }, 'Low', 'Open', 'Close', 'High']];
        ohlcv.forEach(i => {
            candlestickData.push([
                new Date(i.date_utc * 1000),
                i.low,
                i.open,
                i.close,
                i.high
            ]);
        });
        return candlestickData;
    }

    function getVolumeData(ohlcv) {
        var volumeData = [['Date', 'Volume']];
        ohlcv.forEach(i => {
            volumeData.push([new Date(i.date_utc * 1000), i.volume]);
        });
        return volumeData;
    }

    function getDataToDataTable(data) {
        return google.visualization.arrayToDataTable(data);
    }

    function createDashboard(containerId) {
        return new google.visualization.Dashboard(document.getElementById(containerId));
    }

    function createCandlestickChart(containerId) {
        return new google.visualization.ChartWrapper({
            chartType: 'CandlestickChart',
            containerId: containerId,
            colors: ['black'],
            options: {
                legend: 'none',
                bar: { groupWidth: '85%' },
                candlestick: {
                    fallingColor: { strokeWidth: 0.5, stroke: 'darkred', fill: 'red' },
                    risingColor: { strokeWidth: 0.5, stroke: 'darkgreen', fill: 'green' }
                },
                backgroundColor: 'white',
            },
        });
    }

    function createFilterSlider(containerId, startDate, endDate, filterColumnIndex) {
        return new google.visualization.ControlWrapper({
            controlType: 'ChartRangeFilter',
            containerId: containerId,
            options: {
                filterColumnIndex: filterColumnIndex,
                ui: {
                    chartType: 'LineChart',
                    chartOptions: {
                        chartArea: { width: '90%' },
                        hAxis: { baselineColor: 'none' }
                    },
                    minRangeSize: 86400000 // One day in milliseconds
                },
                state: {
                    range: {
                        start: startDate,
                        end: endDate
                    }
                }
            }
        });
    }

    function setFilterSliderState(filterSlider, startDate, endDate) {
        filterSlider.setState({
            range: {
                start: startDate,
                end: endDate
            }
        });
    }

    function createVolumeChart(containerId) {
        return new google.visualization.ChartWrapper({
            chartType: 'ColumnChart',
            containerId: containerId,
            options: {
                legend: 'none',
                bar: { groupWidth: '50%' },
                backgroundColor: 'white'
            }
        });
    }

    function addFilterSliderEventListener(filterSlider, chart, chartData) {
        google.visualization.events.addListener(filterSlider, 'statechange', debounce(function () {
            var state = filterSlider.getState();
            setChartTitle(chart, formatChartDate(state.range.start) + ' - ' + formatChartDate(state.range.end));
            setChartYRange(chartData, chart, state.range.start, state.range.end);
            chart.draw();
        }, 300));
    }

    function setChartYRange(chartData, chart, startDate, endDate) {
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;

        chartData.forEach(function (entry) {
            var date = entry[0]; // Assuming date is at index 0
            if (date >= startDate && date <= endDate) {
                if (entry[1] != 0) {
                    min = Math.min(min, entry[1]);
                    max = Math.max(max, entry[4]);
                }
            }
        });

        chart.setOption('vAxis.viewWindow.min', min * 0.95);
        chart.setOption('vAxis.viewWindow.max', max * 1.05);
    }

    function setChartTitle(chart, title) {
        chart.setOption('title', title);
    }

    function formatChartDate(date) {
        return date.toLocaleString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric' });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function () {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Attach functions to the global window object
    window.getCandlestickData = getCandlestickData;
    window.getVolumeData = getVolumeData;
    window.getDataToDataTable = getDataToDataTable;
    window.createDashboard = createDashboard;
    window.createCandlestickChart = createCandlestickChart;
    window.createFilterSlider = createFilterSlider;
    window.setFilterSliderState = setFilterSliderState;
    window.createVolumeChart = createVolumeChart;
    window.addFilterSliderEventListener = addFilterSliderEventListener;
    window.setChartYRange = setChartYRange;
    window.setChartTitle = setChartTitle;
    window.formatChartDate = formatChartDate;
    window.debounce = debounce;
})();