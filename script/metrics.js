// Metric functions
export function eqNumHectares(numHours, Tco2) {
    const co2HectHour = 11.8 / (365 * 24);
    return Tco2 / (co2HectHour * numHours);
}

export function eqNumFlightsCDGSHANG(Tco2) {
    const flightTco2 = 1.4;
    return Math.round(Tco2 / flightTco2);
}

export function eqCarKm(Tco2) {
    const carKmTco2 = 0.259 / 1e03;
    return Math.round(Tco2 / carKmTco2);
}