(async function () {

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Error fetching data @ ' + url + ':', error);
            throw error; 
        }
    }

    async function fecthIndicatorList(url) {
        try {
            const indicatorTypes = await fetchData(url);
            indicatorTypes.forEach(indicator => {
                $('#indicatorType').append($('<option>', {
                    value: indicator,
                    text: indicator
                }));
            });
            return indicatorTypes;
        } catch (error) {
            console.error('Error fetching JSON data:', error);
        }
    }

    async function fetchIndicatorParams(url) {
        try {
            var parameterFields = $('#parameterFields');
            parameterFields.empty();
            const indicatorParameters = await fetchData(url);
            indicatorParameters.forEach(parameter => {
                parameterFields.append(parameter);
            });
            return parameterFields;
        } catch (error) {
            console.error('Error fetching JSON data:', error);
        }
    }

    window.fetchData = fetchData;
    window.fetchInidcatorList = fecthIndicatorList;
    window.fetchIndicatorParams = fetchIndicatorParams;
})();
