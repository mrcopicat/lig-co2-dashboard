// Tool functions
export function expo(x) {
    var val = x;
    if (val.toString().length > 5) {
        val = Number.parseFloat(val.toExponential()).toPrecision(2);
    }

    return val
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
            numHours = 24 * 7 * 30;
            break;
        case 'year':
            numHours = 24 * 7 * 365;
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