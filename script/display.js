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

// // Update functions
// Global
function updatePercentage(id, value) {
    var percentage = document.getElementById(id);
    percentage.innerHTML = `~${Math.max(value, 1)}%`;
}

function updateCircle(id, value) {
    var circle = document.getElementById(id);
    var circumference = circle.getTotalLength();
    var percent = Math.round(Math.min(Math.max((value), 1), 100));
    var offset = circumference - percent / 100 * circumference;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;
}

// Specific
function updateMap(cityData, periodHoursG, tCo2Em) {
    // Create the map.
    var cityCenter = { lat: Number.parseFloat(cityData.lat), lng: Number.parseFloat(cityData.lng) };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
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
        radius: Math.sqrt(metric.eqNumHectares(periodHoursG, tCo2Em) / Math.PI) * 1e04,
    });
}

// Update functions
function updateMachinePower(updatedValues, periodHours, population) {
    // update main value
    var totPower = document.getElementById('tot-power');
    var totVal =  tool.expo(Math.round(updatedValues.power));
    totPower.innerHTML = `<h1 id="tot-power">${totVal > 0 ? totVal : '- '} <font size="-1">(Kw)</font></h1>`;
    // update percentage
    var percVal = tool.calcPercentPop(population, updatedValues.ratio, totVal, periodHours, 'power');
    updatePercentage('percent-pow', percVal);
    updateCircle('circle-pow', percVal);
};

function updateTotalEnergy(updatedValues, periodHours, population) {
    var totEnergy = document.getElementById('tot-energy');
    var totVal =  tool.expo(Math.round(updatedValues.power * periodHours / 1e03));
    totEnergy.innerHTML  = `<h1 id="tot-energy">${totVal > 0? totVal : '- '} <font size="-1">(Mwh)</font></h1>`;
    // update percentage
    var percVal = tool.calcPercentPop(population, updatedValues.ratio, totVal, periodHours, 'energy');
    updatePercentage('percent-ener', percVal);
    updateCircle('circle-ener', percVal);
};

function updateCo2Emission(updatedValues, tCo2Em, periodHours, population) {
    var totTCO2 = document.getElementById('tot-co2');
    var totVal = tool.expo(Math.round(tCo2Em));
    totTCO2.innerHTML  = `<h1 id="tot-co2">${totVal > 0? totVal : '- '} <font size="-1">(t)</font></h1>`;
    // update percentage
    var percVal = tool.calcPercentPop(population, updatedValues.ratio, totVal, periodHours, 'emission');
    updatePercentage('percent-em', percVal);
    updateCircle('circle-em', percVal);
};

function updateTreeComp(updatedValues, tCo2Em, periodHours, population) {
    var totTreeComp = document.getElementById('tree-comp');
    var totVal = tool.expo(Math.round(metric.eqNumHectares(periodHours, tCo2Em)));
    totTreeComp.innerHTML = `<h1 id="tree-comp">${totVal > 0? totVal : '- '} <font size="-1">(Ha)</font></h1>`;
    // update percentage
    var percVal = tool.calcPercentPop(population, updatedValues.ratio, totVal, periodHours, 'tree');
    updatePercentage('percent-hect', percVal);
    updateCircle('circle-hect', percVal);
};

function updateEqCarDistance(updatedValues, tCo2Em, periodHours, population) {
    var totCarDist = document.getElementById('car-dist');
    var totVal = tool.expo(metric.eqCarKm(tCo2Em));
    totCarDist.innerHTML = `<h1 id="car-dist">${totVal > 0? totVal : '- '} <font size="-1">(Km)</font></h1>`;
    // update percentage
    var percVal = tool.calcPercentPop(population, updatedValues.ratio, totVal, periodHours, 'km');
    updatePercentage('percent-car', percVal);
    updateCircle('circle-car', percVal);
};

function updateEqNumFlights(updatedValues, tCo2Em, periodHours, population) {
    var totNumFlights = document.getElementById('num-flights');
    var totVal = tool.expo(metric.eqNumFlightsCDGSHANG(tCo2Em));
    totNumFlights.innerHTML = `<h1 id="num-flights">${totVal > 0? totVal : '- '} <font size="-1"> °</font></h1>`;
    // update percentage
    var percVal = tool.calcPercentPop(population, updatedValues.ratio, totVal, periodHours, 'flight');
    updatePercentage('percent-flight', percVal);
    updateCircle('circle-flight', percVal);
};

export async function updateMain(updatedValues, data) {
    // Calc some global metrics
    const dateIntervalG = tool.getDateInterval(updatedValues.date, updatedValues.range, updatedValues.period);
    const periodHoursG = tool.periodToHours(updatedValues.range, updatedValues.period);
    const aggHoursG = tool.periodToHours(1, updatedValues.agg);
    const tCo2RateG = await tool.getAsyncGCo2Rate(dateIntervalG, updatedValues.agg) / 1e06;
    console.log(aggHoursG);
    console.log(tCo2RateG);
    const tCo2Em =  await updatedValues.power * aggHoursG * tCo2RateG;
    const cityDataG = data.find(el => el.city == updatedValues.city);

    // Update the windows
    updateMachinePower(updatedValues, periodHoursG, cityDataG.population);
    updateTotalEnergy(updatedValues, periodHoursG, cityDataG.population);
    updateCo2Emission(updatedValues, tCo2Em, periodHoursG, cityDataG.population);

    updateTreeComp(updatedValues, tCo2Em, periodHoursG, cityDataG.population);
    updateEqCarDistance(updatedValues, tCo2Em, periodHoursG, cityDataG.population);
    updateEqNumFlights(updatedValues, tCo2Em, periodHoursG, cityDataG.population);

    // Update the map
    window.initMap = updateMap(cityDataG, periodHoursG, tCo2Em);
}