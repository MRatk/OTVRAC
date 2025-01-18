document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/db');
    if(!response.ok){
        throw new Error('Receiving database data Error');
    }
    const responseJSON = await response.json();
    const data = responseJSON.database
    //console.log(data);
    const tableBody = document.querySelector('#mobiteliTable tbody');
    tableBody.innerHTML = '';
    const additionalPropertySearch = (properties, name) => {
        const property = properties.find(prop => prop.name === name);
        return property.value;
    };

    data.forEach(dataRow => {
        const publishingYear = additionalPropertySearch(dataRow.additionalProperty, "publishingYear");
        const operatingSystem = additionalPropertySearch(dataRow.additionalProperty, "operatingSystem");
        const RAM = additionalPropertySearch(dataRow.additionalProperty, "RAM");
        const camera = additionalPropertySearch(dataRow.additionalProperty, "camera");
        const battery = additionalPropertySearch(dataRow.additionalProperty, "battery");
        const row = `
                <tr>
                    <td>${dataRow.name}</td>
                    <td>${dataRow.brand.name}</td>
                    <td>${publishingYear}</td>
                    <td>${dataRow.model}</td>
                    <td>${dataRow.offers.price}</td>
                    <td>${operatingSystem}</td>
                    <td>${RAM}</td>
                    <td>${dataRow.weight.value}</td>
                    <td>${camera}</td>
                    <td>${dataRow.height.value}</td>
                    <td>${battery}</td>
                </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    let filteredData = data;
    document.querySelector('#search').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filterSelector = document.getElementById('filter').value;

        let fData = data;

        if(filterSelector !== "blank"){
            //console.log("filter selector: ", filterSelector)
            fData = data.filter(colum =>{
                //console.log(colum)
                if (filterSelector.includes('additionalProperty')) {
                    const propertyName = filterSelector.split('.')[1];
                    const prop = colum.additionalProperty.find(item => item.name === propertyName);
                    if (prop) {
                        return prop.value.toString().toLowerCase().includes(searchTerm);
                    }
                }else if (filterSelector === 'brand.name' && colum.brand && colum.brand.name) {
                    return colum.brand.name.toLowerCase().includes(searchTerm);
                } else if (filterSelector === 'offers.price' && colum.offers && colum.offers.price) {
                    return colum.offers.price.toString().includes(searchTerm);
                }
                else if(colum[filterSelector]){
                    return colum[filterSelector].toString().toLowerCase().includes(searchTerm);
                }
                return false;
            });
            //console.log(fData)
        }else{
            fData = data.filter(obj =>{
                return Object.values(obj).some(colum =>{
                    return colum.toString().toLowerCase().includes(searchTerm);
                })
            })
        }
        filteredData = fData;
        tableBody.innerHTML = '';
        fData.forEach(dataRow => {
            const publishingYear = additionalPropertySearch(dataRow.additionalProperty, "publishingYear");
            const operatingSystem = additionalPropertySearch(dataRow.additionalProperty, "operatingSystem");
            const RAM = additionalPropertySearch(dataRow.additionalProperty, "RAM");
            const camera = additionalPropertySearch(dataRow.additionalProperty, "camera");
            const battery = additionalPropertySearch(dataRow.additionalProperty, "battery");
            const row = `
                <tr>
                    <td>${dataRow.name}</td>
                    <td>${dataRow.brand.name}</td>
                    <td>${publishingYear}</td>
                    <td>${dataRow.model}</td>
                    <td>${dataRow.offers.price}</td>
                    <td>${operatingSystem}</td>
                    <td>${RAM}</td>
                    <td>${dataRow.weight.value}</td>
                    <td>${camera}</td>
                    <td>${dataRow.height.value}</td>
                    <td>${battery}</td>
                </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    });

    document.getElementById('filteredJSON').addEventListener('click', ()=>{
        const jsonData = JSON.stringify(filteredData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mobiteli_filtered.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById('filteredCSV').addEventListener('click', () =>{
        let csvData = '';
        const dataHeader = Object.keys(filteredData[0]).join(',');
        csvData += dataHeader + '\n';
        filteredData.forEach(rows =>{
            const row = Object.values(rows).map(el => `"${el}"`).join(',');
            csvData += row + '\n';
        })
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mobiteli_filtered.csv';
        a.click();
        URL.revokeObjectURL(url);
    })
})

