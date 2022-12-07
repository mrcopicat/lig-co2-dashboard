import * as tool from './tools.js';
import * as metric from './metrics.js';

// Display functions
export function showDataTable(begin, end, data) {
    // Show a partition of the top500 data table
    data.slice(begin, end).forEach(row => {
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

function updateMap(updatedValues, data, periodHoursG, tCo2Em) {
    // Create the map.
    const coord = data.find(el => el.city == updatedValues.city);
    var cityCenter = { lat: Number.parseFloat(coord.lat), lng: Number.parseFloat(coord.lng) };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7.5,
        center: cityCenter,
        mapTypeId: "terrain",
    });

    // Construct the forest circle 
    const cityCircle = new google.maps.Circle({
        strokeColor: "red",
        strokeOpacity: 0.8,
        strokeWeight: 1.5,
        fillColor: "green",
        fillOpacity: 0.65,
        map,
        center: cityCenter,
        radius: Math.sqrt(metric.eqNumHectares(periodHoursG,tCo2Em)/Math.PI) * 1e04,
    });
}

// Update functions
function updateMachinePower(updatedValues) {
    var totPower = document.getElementById('tot-power');
    var totVal =  tool.expo(Math.round(updatedValues.power));
    totPower.innerHTML = `<h1 id="tot-power">${totVal > 0 ? totVal : '- '} <font size="-1">(Kw)</font></h1>`;
};

function updateTotalEnergy(updatedValues, periodHoursG) {
    var totEnergy = document.getElementById('tot-energy');
    var totVal =  tool.expo(Math.round(updatedValues.power * periodHoursG / 1e03));
    totEnergy.innerHTML  = `<h1 id="tot-energy">${totVal > 0? totVal : '- '} <font size="-1">(Mwh)</font></h1>`;
};

function updateCo2Emission(tCo2Em) {
    var totTCO2 = document.getElementById('tot-co2');
    var totVal = tool.expo(Math.round(tCo2Em));
    totTCO2.innerHTML  = `<h1 id="tot-co2">${totVal > 0? totVal : '- '} <font size="-1">(t)</font></h1>`;
};

function updateTreeComp(periodHoursG, tCo2Em) {
    var totTreeComp = document.getElementById('tree-comp');
    var totVal = tool.expo(Math.round(metric.eqNumHectares(periodHoursG,tCo2Em)));
    totTreeComp.innerHTML = `<h1 id="tree-comp">${totVal > 0? totVal : '- '} <font size="-1">(Ha)</font></h1>`;
};

function updateEqCarDistance(tCo2Em) {
    var totCarDist = document.getElementById('car-dist');
    var totVal = tool.expo(metric.eqCarKm(tCo2Em));
    totCarDist.innerHTML = `<h1 id="car-dist">${totVal > 0? totVal : '- '} <font size="-1">(Km)</font></h1>`;
};

function updateEqNumFlights(tCo2Em) {
    var totNumFlights = document.getElementById('num-flights');
    var totVal = tool.expo(metric.eqNumFlightsCDGSHANG(tCo2Em));
    totNumFlights.innerHTML = `<h1 id="num-flights">${totVal > 0? totVal : '- '} <font size="-1"> °</font></h1>`;
};

export async function updateMain(updatedValues) {
    // Calc some global metrics
    const dateIntervalG = tool.getDateInterval(updatedValues.date, updatedValues.range, updatedValues.period);
    const periodHoursG = tool.periodToHours(updatedValues.range, updatedValues.period);
    const aggHoursG = tool.periodToHours(1, updatedValues.agg);
    const tCo2RateG = await tool.getAsyncGCo2Rate(dateIntervalG, updatedValues.agg) / 1e06;
    const tCo2Em =  await updatedValues.power * (periodHoursG / aggHoursG) * tCo2RateG;

    // Update the windows
    updateMachinePower(updatedValues);
    updateTotalEnergy(updatedValues, periodHoursG);
    updateCo2Emission(tCo2Em);

    updateTreeComp(periodHoursG, tCo2Em);
    updateEqCarDistance(tCo2Em);
    updateEqNumFlights(tCo2Em);

    // Update the map
    window.initMap = updateMap(updatedValues, citiesData, periodHoursG, tCo2Em);
}