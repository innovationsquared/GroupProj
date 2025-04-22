import * as d3 from 'd3';
import { setupCanvas, setupControls } from './control.js'; // this has to be given as they want a svg to control the graphs


d3.csv('../data/data.csv').then(data => {

    const languageCounts = d3.rollup(
        data,
        v => v.length,
        d => d.language 
    );

    const languagePopularity = Array.from(languageCounts, ([language, count]) => ({ language, count }));

    languagePopularity.sort((a, b) => b.count - a.count);

    console.log('Sorted Language Popularity:', languagePopularity);
    languagePopularity.forEach(item => {
        console.log(`Language: ${item.language}, Count: ${item.count}`);
    });

    const parsedData = data.map(d => ({
        x: +d.x,
        y: +d.y,
        r: +d.r,
        category: d.category 
    }));

    
    const width = 800;
    const height = 600;

    
    const svg = d3.select('#chart-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    
    const xScale = d3.scaleLinear()
        .domain(d3.extent(parsedData, d => d.x))
        .range([50, width - 50]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(parsedData, d => d.y))
        .range([height - 50, 50]);

    const rScale = d3.scaleSqrt()
        .domain([0, d3.max(parsedData, d => d.r)])
        .range([5, 20]);

    
    svg.selectAll('circle')
        .data(parsedData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', d => rScale(d.r))
        .attr('fill', d => d3.schemeCategory10[d.category % 10])
        .attr('opacity', 0.7);

    
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
        .attr('transform', `translate(0, ${height - 50})`)
        .call(xAxis);

    svg.append('g')
        .attr('transform', `translate(50, 0)`)
        .call(yAxis);

    
    setupControls(svg, parsedData, xScale, yScale, rScale);
}).catch(error => {
    console.error('Error loading the CSV data:', error);
});