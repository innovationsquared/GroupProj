
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

        const licenseCounts = d3.rollups(
            //these dumb brits spell license wrong
            data.map(d=> ({...d, licence: d.licence || 'None'})),
            v=>v.length,
            d => d.licence
        );
        const licenses = licenseCounts.map(d=>d[0]);
        const counts = licenseCounts.map(d=>d[1]);

        console.log(licenseCounts);
        const xScale = d3.scaleBand()
            .domain(licenses)
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0,d3.max(counts)])
            .range([height, 0]);

        const colorScale = d3.scaleOrdinal()
            .domain(licenses)
            .range(d3.schemeCategory10);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append('g')
            .attr('transform', `translate(${0}, ${height})`)  
            .call(xAxis)
            .selectAll('text')
            .attr("transform", `rotate(${-30})`)
            .style("text-anchor","end");



        svg.append('g')
            .attr('transform', `translate(${0},${0})`)
            .call(yAxis);

        svg.selectAll('rect')
            .data(licenseCounts)
            .enter()
            .append('rect')
            .attr('x', d=>xScale(d[0]))
            .attr('y', d=>yScale(d[1]))
            .attr('width', xScale.bandwidth())
            .attr('height', d=> height - yScale(d[1]))
            .attr('fill', d => colorScale(d[0]))
            // double click to filter by license added Zach StPierre
            .on('dblclick', (event, d) => {
                this.control.filterByLicense(d[0]);
            });
        svg.selectAll('text.count-label')
            .data(licenseCounts)
            .enter()
            .append('text')
            .attr('class', 'count-label')
            .attr('x', d=>xScale(d[0]))
            .attr('y', d=>yScale(d[1] - 0))
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', 'black')
            .text(d=>d[1]);
    }
}

