document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/db');
    if(!response.ok){
        throw new Error('Receiving database data Error');
    }
    const data = await response.json();
    //console.log(data);
    const tableBody = document.querySelector('#mobiteliTable tbody');
    tableBody.innerHTML = '';
    data.forEach(dataRow => {
        const row = `
                <tr>
                    <td>${dataRow.ime_modela}</td>
                    <td>${dataRow.tvrtka}</td>
                    <td>${dataRow.godina_proizvodnje}</td>
                    <td>${dataRow.naziv_verzije}</td>
                    <td>${dataRow.cijena}</td>
                    <td>${dataRow.operacijski_sustav}</td>
                    <td>${dataRow.ram}</td>
                    <td>${dataRow.tezina_gram}</td>
                    <td>${dataRow.kamera_mp}</td>
                    <td>${dataRow.visina_inch}</td>
                    <td>${dataRow.baterija_mah}</td>
                </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    let filteredData = data;
    document.querySelector('#search').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filterSelector = document.getElementById('filter').value;

        let fData = data;

        if(filterSelector !== "blank"){
            fData = data.filter(colum =>{
                if(colum[filterSelector]){
                    return colum[filterSelector].toString().toLowerCase().includes(searchTerm);
                }
                return false;
            });
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
            const row = `
                <tr>
                    <td>${dataRow.ime_modela}</td>
                    <td>${dataRow.tvrtka}</td>
                    <td>${dataRow.godina_proizvodnje}</td>
                    <td>${dataRow.naziv_verzije}</td>
                    <td>${dataRow.cijena}</td>
                    <td>${dataRow.operacijski_sustav}</td>
                    <td>${dataRow.ram}</td>
                    <td>${dataRow.tezina_gram}</td>
                    <td>${dataRow.kamera_mp}</td>
                    <td>${dataRow.visina_inch}</td>
                    <td>${dataRow.baterija_mah}</td>
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

