// Imports
import fetch from "node-fetch";

// Metric functions
function eqNumHectares(numDays, Tco2) {
    const co2HectDay = 11.8 / 365;
    return Tco2 / (co2HectDay * numDays);
}

function eqNumFlightsCDGSHANG(Tco2) {
    const flightTco2 = 1.4;
    return Math.round(Tco2 / flightTco2);
}

function eqCarKm(Tco2) {
    const carKmTco2 = 0.259 / 1e03;
    return Math.round(Tco2 / carKmTco2);
}

function totalCo2EmissionT(gCo2Rates, power, aggPolicy='hour') {
    var totalEmission = 0;
    let numHours = 1;

    switch (aggPolicy) {
        case 'day':
            numHours = 24;
            break;
        case 'week':
            numHours = 24 * 7;
            break;
        default:
            numHours = 1;
    };

    gCo2Rates.forEach(rate => {
        totalEmission += rate * numHours * power / 1e06;
    });
    
    return totalEmission;
}

// Tool functions
function periodToHours(num, period) {
    var numHours;
    switch (period) {
        case 'day':
            numHours = 24;
            break;
        case 'week':
            numHours = 24 * 7;
            break;
        case 'month':
            numHours = 24 * 7;
            break;
        case 'year':
            numHours = 24 * 7;
            break;
        default:
            numHours = 1;
    };
    return numHours *= num;
}

async function getAsyncCo2Rate(date, periodD) {
    const url = (
        'https://odre.opendatasoft.com/api/v2/catalog/datasets/eco2mix-national-cons-def/records?' +
        new URLSearchParams({ 
            select: 'date, AVG(taux_co2) as avg_taux_co2',
            where: `date_heure IN [date'${'2021-01-01'}'..date'${'2021-01-09'}']`,
            group_by: "date"
            }).toString()
    );

    const result = await fetch(url)
        .then(response => response.json());

    var output = 0;
    result.records.forEach(element => {
        output += element.record.fields.avg_taux_co2;
    })
    return output
}

// Update functions
function updateMachinePower(updatedValues) {
    const power = document.getElementById('t-power');
    power.innerHTML = updatedValues.power;
};
function updateTotalEnergy(updatedValues) {
    var totEnergy = document.getElementById('tot-energy');
    totEnergy.innerHTML = updatedValues.power * updatedValues.periodH;

};
function updateCo2Emission(updatedValues);

function updateTreeComp(updatedValues);
function updateEqCarDistance(updatedValues);
function updateEqNumFlights(updatedValues);