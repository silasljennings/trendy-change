(function () {

    var filterSliderListener;

    function createDashboard(containerId) {
        return new google.visualization.Dashboard(document.getElementById(containerId));
    }


    function createCandlestickChart(containerId) {

        var options = {
            legend: 'none',
            titleTextStyle: {
            //96c5c5 - make the open high low close text ths color
                color: '#d6a87b'
            },
            bar: { groupWidth: '85%' },
            colors: ['white'],
            candlestick: {
                fallingColor: { strokeWidth: 0.5, stroke: 'darkred', fill: 'red' },
                risingColor: { strokeWidth: 0.5, stroke: 'darkgreen', fill: 'green' }
            },
            backgroundColor: 'black',
            hAxis: {
                gridlines: {
                    color: '#284848'
                },
                textStyle: {
                    color: '#d7d7b7' 
                },
            },
            vAxis: {
                gridlines: {
                    color: '#17202A'
                },
                textStyle: {
                    color: '#d7d7b7' 
                }
            },
        };

        

        return new google.visualization.ChartWrapper({
            chartType: 'CandlestickChart',
            containerId: containerId,
            colors: ['black'],
            options, options
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

        if (filterSliderListener) {
            google.visualization.events.removeListener(filterSliderListener);
        }

        filterSliderListener = google.visualization.events.addListener(filterSlider, 'statechange', debounce(function () {
            var state = filterSlider.getState();
            var today = new Date();
            var endOfRange = new Date(state.range.end);
            var isAtEnd = endOfRange.toDateString() === today.toDateString();
            setChartTitle(chart, formatChartDate(state.range.start) + ' - ' + formatChartDate(state.range.end));
            setChartYRange(chartData, chart, state.range.start, state.range.end);
            setChartXRange(isAtEnd, chart)
            chart.draw();
        }, 50));
    }

    function setChartYRange(chartData, chart, startDate, endDate) {
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;

        chartData.forEach(function (entry) {
            var date = entry[0];
            if (date >= startDate && date <= endDate) {
                if (entry[1] != 0) {
                    min = Math.min(min, entry[1]);
                    max = Math.max(max, entry[4]);
                }
            }
        });

        chart.setOption('vAxis.viewWindow.min', min * 0.80);
        chart.setOption('vAxis.viewWindow.max', max * 1.20);
    }

    function setChartXRange(isAtEnd, chart) {
        if (isAtEnd) {
            var currentDate = new Date(); // Get the current date
            var futureDate = new Date(currentDate.getTime() + (50 * 24 * 60 * 60 * 1000)); // Add 50 days to the current date
            chart.setOption('hAxis.viewWindow.max', futureDate); // Set the maximum value to the future date
        } else {
            chart.setOption('hAxis.viewWindow.max', null); // Unset the maximum value
        }
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


    function getSeriesOptionsForChart(dataTable) {

        var seriesOptions = {};
        var seriesNumber = 1;

        for (var i = 0; i < dataTable.getNumberOfColumns(); i++) {
            var columnLabel = dataTable.getColumnLabel(i);
            var color = setIndicatorColor(columnLabel);
            if (columnLabel.includes("SMA") || columnLabel.includes("EMA")) {
                seriesOptions[seriesNumber] = {
                    type: 'area', color: color, areaOpacity: 0.20, lineWidth: 0.5, visibleInLegend: false
                };
                seriesNumber++;
            }

            if (!columnLabel.includes("SMA") && !columnLabel.includes("EMA") && columnLabel.includes('-')) {
                seriesOptions[seriesNumber] = {
                    type: 'line', color: color
                };
                seriesNumber++;
            }
        }
        return seriesOptions;
    }

    function setIndicatorColor(indicatorHeader) {

        if (indicatorHeader.includes("BB")) {
            return "cbc8ee";
        } else if (indicatorHeader.includes("KC")) {
            return "eeeec8";
        } else if (indicatorHeader.includes("SMA")) {
            return "#dcb58e";
        } else if (indicatorHeader.includes("EMA")) {
            return "#a1e2e2";
        } else {
            return "red";
        }
    }

  
    window.createDashboard = createDashboard;
    window.createCandlestickChart = createCandlestickChart;
    window.createFilterSlider = createFilterSlider;
    window.setFilterSliderState = setFilterSliderState;
    window.createVolumeChart = createVolumeChart;
    window.addFilterSliderEventListener = addFilterSliderEventListener;
    window.setChartYRange = setChartYRange;
    window.setChartXRange = setChartXRange;
    window.setChartTitle = setChartTitle;
    window.formatChartDate = formatChartDate;
    window.getSeriesOptionsForChart = getSeriesOptionsForChart;
})();