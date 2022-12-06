
import fetch from "node-fetch";
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

doAsyncTask();