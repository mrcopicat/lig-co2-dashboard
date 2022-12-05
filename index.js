// Variables
var showIdx = 0;
const themeToggler = document.querySelector(".theme-toggler");
const showAllTable = document.querySelector("main .top-500 a");
// Actions 
// // change theme
themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');
    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
})

function showData(begin, end) {
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

showData(0, defaultShow);

showAllTable.addEventListener('click', () => {
    showIdx++;
    showData(defaultShow * showIdx, defaultShow * (showIdx + 1));
    console.log(defaultShow);
})

