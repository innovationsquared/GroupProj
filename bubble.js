import * as d3 from 'd3';
import { setupCanvas, setupControls } from './control.js';


// Load the CSV data
d3.csv('../data/data.csv').then(data => {

    const languageCounts = d3.rollup(
        data,
        v => v.length,
        d => d.language // Replace 'language' with the actual column name for language in your CSV
    );

    // Convert the Map to an array for easier processing
    const languagePopularity = Array.from(languageCounts, ([language, count]) => ({ language, count }));

    // Sort the array by popularity in descending order
    languagePopularity.sort((a, b) => b.count - a.count);

    console.log('Sorted Language Popularity:', languagePopularity);
    // Add language labels to the array
    languagePopularity.forEach(item => {
        console.log(`Language: ${item.language}, Count: ${item.count}`);
    });

    // Parse the data
    const parsedData = data.map(d => ({
        x: +d.x, // Replace 'x' with the actual column name for x-axis
        y: +d.y, // Replace 'y' with the actual column name for y-axis
        r: +d.r, // Replace 'r' with the actual column name for radius
        category: d.category // Replace 'category' with the actual column name for grouping
    }));

    // Set up dimensions
    const width = 800;
    const height = 600;

    // Create SVG container
    const svg = d3.select('#chart-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(parsedData, d => d.x))
        .range([50, width - 50]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(parsedData, d => d.y))
        .range([height - 50, 50]);

    const rScale = d3.scaleSqrt()
        .domain([0, d3.max(parsedData, d => d.r)])
        .range([5, 20]);

    // Create bubbles
    svg.selectAll('circle')
        .data(parsedData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', d => rScale(d.r))
        .attr('fill', d => d3.schemeCategory10[d.category % 10]) // Color by category
        .attr('opacity', 0.7);

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
        .attr('transform', `translate(0, ${height - 50})`)
        .call(xAxis);

    svg.append('g')
        .attr('transform', `translate(50, 0)`)
        .call(yAxis);

    // Set up controls
    setupControls(svg, parsedData, xScale, yScale, rScale);
}).catch(error => {
    console.error('Error loading the CSV data:', error);
});