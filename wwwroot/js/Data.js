
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

    function removeDataColumn(dataTable, columnName) {
        var columnIndex = getColumnIndexByName(dataTable, columnName);
        if (columnIndex !== -1) {
            dataTable.removeColumn(columnIndex);
        }
        return dataTable;
    }

    function reAddDataColumn(dataTable, aggregateDataTable, columnName) {
        var columnIndex = getColumnIndexByName(aggregateDataTable, columnName);
        if (columnIndex !== -1) {
            dataTable.insertColumn(columnIndex, 'number', columnName);
            var columnData = getColumnData(aggregateDataTable, columnIndex);
            for (var i = 0; i < columnData.length; i++) {
                dataTable.setCell(i, columnIndex, columnData[i]);
            }
        }
        return dataTable;
    }

    function addDataColumn(dataTable, aggregateDataTable, columnName, columnData) {
        
        dataTable.addColumn('number', columnName);
        aggregateDataTable.addColumn('number', columnName);
        var columnIndex = getColumnIndexByName(dataTable, columnName);
        if (columnIndex !== -1) {
            for (var i = 0; i < columnData.length; i++) {
                dataTable.setCell(i, columnIndex, columnData[i]);
                aggregateDataTable.setCell(i, columnIndex, columnData[i]);
            }
        }
      
        return dataTable;
    }

    function getColumnData(dataTable, columnIndex) {
        var columnData = [];
        for (var i = 0; i < dataTable.getNumberOfRows(); i++) {
            columnData.push(dataTable.getValue(i, columnIndex));
        }
        return columnData;
    }

    function getColumnIndexByName(dataTable, columnName) {
        var numberOfColumns = dataTable.getNumberOfColumns();
        for (var i = 0; i < numberOfColumns; i++) {
            if (dataTable.getColumnLabel(i) === columnName) {
                return i;
            }
        }
        return -1;
    }

    function checkColumnNameExists(dataTable, columnNames) {
        var numberOfColumns = dataTable.getNumberOfColumns();
        for (var i = 0; i < numberOfColumns; i++) {
            var columnLabel = dataTable.getColumnLabel(i);
            if (columnNames.includes(columnLabel)) {
                return true;
            }
        }
        return false;
    }



    // Attach functions to the window object
    window.getCandlestickData = getCandlestickData;
    window.getVolumeData = getVolumeData;
    window.getDataToDataTable = getDataToDataTable;
    window.getColumnIndexByName = getColumnIndexByName;
    window.checkColumnNameExists = checkColumnNameExists;
    window.addDataColumn = addDataColumn;
    window.reAddDataColumn = reAddDataColumn;
    window.removeDataColumn = removeDataColumn;

})();