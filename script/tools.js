// Tool functions
export function expo(x) {
    var val = x;
    if (val.toString().length > 5) {
        val = Number.parseFloat(val.toExponential()).toPrecision(2);
    }

    return val
}

export function calcPercentPop(population, ratio, value, timeH, metric) {
    // data
    const avgEnerPersonY = 6.679; // 2018 stat (MWh/y)
    const avgKmPersonY = 13117; // 2022 stat (km/y)
    const avgEmPersonY = 4.5; // 2019 stat (t/y)
    const avgFlightPersonY = 4.2; // 2021 stat (flight/y)
    const hectaresLostFr = 31600; // 2021 stat (Ha)

    // time (to years):
    var timeY = timeH / (365 *24);

    // result
    var result;
    switch (metric) {
        case 'power':
            result = Math.round(100 * value / (population * ratio * avgEnerPersonY * 1e03 / (365 * 24)));
            break;
        case 'energy':
            result = Math.round(100 * value  * timeY / (population * ratio * avgEnerPersonY));
            break;
        case 'emission':
            result = Math.round(100 * value  * timeY / (population * ratio * avgEmPersonY));
            break;
        case 'tree':
            result = Math.round(100 * value  * timeY / (hectaresLostFr));
            break;
        case 'km':
            result = Math.round(100 * value  * timeY / (population * ratio * avgKmPersonY));
            break;
        case 'flight':
            result = Math.round(100 * value  * timeY / (population * ratio * avgFlightPersonY));
            break;
        default:
            throw 'undefined (or yet not added) metric value.'
    }
    return result;
}
export function periodToHours(num, period) {
    var numHours;
    switch (period) {
        case 'day':
            numHours = 24;
            break;
        case 'week':
            numHours = 24 * 7;
            break;
        case 'month':
            numHours = 24 * 30;
            break;
        case 'year':
            numHours = 24 * 365;
            break;
        default:
            numHours = 1;
    };
    return numHours *= num;
}

export function aggregateBy(aggPolicy) {
    var aggFilter;
    switch (aggPolicy) {
        case 'day':
            aggFilter = "YYYY-MM-dd";
            break;
        case 'month':
            aggFilter = "YYYY-MM";
            break;
        case 'year':
            aggFilter = "YYYY";
            break;
        default:
            aggFilter = "YYYY-MM-dd'T'HH";
    };
    return aggFilter;
}

export function getDateInterval(date, range, period) {
    const initialDate = new Date(date);
    const rangeDate = new Date(initialDate - periodToHours(range, period) * 60 * 60 * 1000);

    const initialDateStr = initialDate.toISOString().slice(0, 13);
    const rangeDateStr = rangeDate.toISOString().slice(0, 13);

    const finalDates = range < 0 ? {
        start: initialDateStr, end: rangeDateStr
    } : {
        start: rangeDateStr, end: initialDateStr
    };

    return finalDates;
}

export async function getAsyncGCo2Rate(dateInterval, aggPolicy = 'day') {
    const url = (
        'https://odre.opendatasoft.com/api/v2/catalog/datasets/eco2mix-national-cons-def/records?' +
        new URLSearchParams({
            select: 'date, AVG(taux_co2) as avg_taux_co2',
            where: `date_heure IN [date'${dateInterval.start}'..date'${dateInterval.end}']`,
            group_by: `date_format(date_heure, "${aggregateBy(aggPolicy)}")`
        }).toString()
    );

    const result = await fetch(url)
        .then(response => response.json());

    const initialValue = 0;
    const totRate = result.records.reduce(
        (accumulator, currentValue) => accumulator + currentValue.record.fields.avg_taux_co2,
        initialValue
    );
    console.log(totRate);
    return totRate;
}