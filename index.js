// // Variables
var showIdx = 0;

// // Queries
const themeToggler = document.querySelector(".theme-toggler");
const showAllTable = document.querySelector("main .top-500 a");

const periodNumFilter = document.querySelector("aside .sidebar input[name='period-num']");
const periodWindowFilter = document.querySelector("aside .sidebar select[name='period-window'");
const dateFilter = document.querySelector("aside .sidebar input[name='date']");
const machineFilter = document.querySelector("aside .sidebar select[name='machines']");
const powerFilter = document.querySelector("aside .sidebar input[name='other-power']");

// // Functions
// Display (& update) the top 500 data 
function showDataTable(begin, end) {
    top500Data.slice(begin, end).forEach(row => {
        const tr = document.createElement('tr');
        const trContent = `
            <td>${row.Rank}</td>
            <td>${row.Name}</td>
            <td>${row.TotalCores}</td>
            <td>${row.Rmax}</td>
            <td>${row.Rpeak}</td>
            <td>${row.Powerkw}</td>
            <td class="danger">${row.EnergyEfficiency}</td>
            `;
            tr.innerHTML = trContent;
            document.querySelector('table tbody').appendChild(tr);
    })
}

top500Data.slice(0, 20).forEach(row => {
    const option = document.createElement('option');
    //var optionContent;
    if (row.Rank == 1) {
        const optionContent = `
            <option value="${row.Name} selected="selected">${row.Name}</option>
            `;
        option.innerHTML = optionContent;
        machineFilter.appendChild(option);
    } else {
        const optionContent = `
            <option value="${row.Name}">${row.Name}</option>
            `;
        option.innerHTML = optionContent;
        machineFilter.appendChild(option);
    }
})
// Calculation metrics
//function emissionCO2(tauxCO2, )

// // Actions 
// change theme
themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');
    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');

})

// shows the next {defaultShow} rows
showDataTable(0, defaultShow);
showAllTable.addEventListener('click', () => {
    showIdx++;
    showDataTable(defaultShow * showIdx, defaultShow * (showIdx + 1));
    console.log(defaultShow);
    
})

periodWindowFilter.addEventListener('change', () => {
    document.getElementById('t-power').innerHTML = 0;
})

machineFilter.addEventListener('change', () => {
    if (machineFilter.value == 'other') {
        document.getElementById("power-number").disabled = false;
        document.getElementById("power-number").value = 1000;
    } else {
        const powerTemp = Number(
            top500Data.find(element => element.Name == machineFilter.value).Powerkw.replace(',', ''))
        document.getElementById("power-number").disabled = true;
        document.getElementById("power-number").value = powerTemp;
    }
})

document.body.addEventListener('change', event => {
    if (event.target !== periodNumFilter &&
        event.target !== periodWindowFilter &&
        event.target !== dateFilter &&
        event.target !== machineFilter) {
        return
    }
    // Fetch the update values
    var updatedValues = {
        periodH: periodToHours(periodNumFilter.value, periodWindowFilter.value),
        date: dateFilter.value,
        power: powerFilter.value
    }

    // Update the windows
    // updateMachinePower(updatedValues);
    // updateTotalEnergy(updatedValues);
    // updateCo2Emission(updatedValues);

    // updateTreeComp(updatedValues);
    // updateEqCarDistance(updatedValues);
    // updateEqNumFlights(updatedValues);

})