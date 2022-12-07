// // Imports
import * as display from './script/display.js';

// // Variables
var showIdx = 0;

// // Queries
const themeToggler = document.querySelector(".theme-toggler");
const showAllTable = document.querySelector("main .top-500 a");

const periodNumFilter = document.querySelector("aside .sidebar input[name='period-num']");
const periodWindowFilter = document.querySelector("aside .sidebar select[name='period-window'");
const dateFilter = document.querySelector("aside .sidebar input[name='date']");
const aggFilter = document.querySelector("aside .sidebar select[name='agg-window']");
const machineFilter = document.querySelector("aside .sidebar select[name='machines']");
const powerFilter = document.querySelector("aside .sidebar input[name='other-power']");
const cityFilter = document.querySelector("aside .sidebar select[name='cities']");

// // First appearance
// Display (& update) the top 500 slider
top500Data.slice(0, 50).forEach(row => {
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

// Display (& update) the cities slider
citiesData.forEach(row => {
    const option = document.createElement('option');
    //var optionContent;
    if (row.Rank == 1) {
        console.log(row.city)
        const optionContent = `
            <option value="${row.city} selected="selected">${row.city}</option>
            `;
        option.innerHTML = optionContent;
        cityFilter.appendChild(option);
    } else {
        const optionContent = `
            <option value="${row.city}">${row.city}</option>
            `;
        option.innerHTML = optionContent;
        cityFilter.appendChild(option);
    }
})


// // Actions & Events
// change theme
themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');
    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');

})

// shows the next {defaultShow} rows
display.showDataTable(0, defaultShow, top500Data);
showAllTable.addEventListener('click', () => {
    showIdx++;
    display.showDataTable(defaultShow * showIdx, defaultShow * (showIdx + 1), top500Data);
    console.log(defaultShow);
    
})

// enable/disable power window based on the user's  machine choice
machineFilter.addEventListener('change', () => {
    if (machineFilter.value == 'other') {
        document.getElementById("power-number").disabled = false;
    } else {
        const powerTemp = Math.round(Number(
            top500Data.find(element => element.Name == machineFilter.value).Powerkw.replace(',', '')));
        document.getElementById("power-number").disabled = true;
        document.getElementById("power-number").value = powerTemp;
    }
})

// Change the displayed values based on filter
document.body.addEventListener('change', event => {
    // if none of the values are changed, do NOTHING!
    if (event.target !== periodNumFilter &&
        event.target !== periodWindowFilter &&
        event.target !== dateFilter &&
        event.target !== aggFilter &&
        event.target !== machineFilter &&
        event.target !== powerFilter &&
        event.target !== cityFilter) {
        return
    }
    // Update the main window
    var updatedValues = {
        date: dateFilter.value,
        range: periodNumFilter.value,
        period: periodWindowFilter.value,
        agg: aggFilter.value,
        power: powerFilter.value,
        city: cityFilter.value
    }
    display.updateMain(updatedValues);
})
