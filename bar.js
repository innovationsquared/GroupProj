// import Chart from 'chart.js/auto';
// import Papa from 'papaparse';


// fetch('./data/data.csv') 
//     .then(response => response.text())
//     .then(csvData => {
//         const parsedData = Papa.parse(csvData, { header: true });
//         const labels = parsedData.data.map(row => row['Label']); 
//         const values = parsedData.data.map(row => parseFloat(row['Value'])); 

//         const ctx = document.getElementById('myBarChart').getContext('2d');
//         new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: labels, // X-axis labels
//                 datasets: [{
//                     label: 'Dataset Label',
//                     data: values, // Y-axis values
//                     backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                     borderColor: 'rgba(75, 192, 192, 1)',
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });
//     })
//     .catch(error => console.error('Error loading data:', error));

class Bar {
    constructor(data, svg, size, control) {
        this.data = data;
        this.svg = svg;
        this.size = size;
        this.control = control;

        const width = this.size.width;
        const height = this.size.height;

        const parsedData = this.data.map((d, i) => ({
            index: i,
            label: d.Label,
            value: +d.Value
        }));

        const x = d3.scaleBand()
            .domain(parsedData.map(d => d.label))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(parsedData, d => d.value)])
            .nice()
            .range([height, 0]);

        this.svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        this.svg.append('g')
            .call(d3.axisLeft(y));

        this.svg.selectAll('.bar')
            .data(parsedData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.label))
            .attr('y', d => y(d.value))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.value))
            .attr('fill', 'steelblue');
        }
    }

