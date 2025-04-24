// radviz.js

// Assuming the dataset is already available in the directory or hosted
d3.csv('./data/github_dataset.csv').then(data => {

    const size = 500; // Size of the SVG container (from control.js)
    const radius = size * 0.3; // Radius of the RadViz circle

    // Use existing #radViz container defined in control.js
    const svg = d3.select('#radVizSvg') // Using the existing SVG container from #radViz
        .attr('width', size)
        .attr('height', size)
        .append('g')
        .attr('transform', `translate(${size / 2}, ${size / 2})`);

    // Color scale for languages (use d3.schemeCategory10 or define custom colors)

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg.append('circle')
        .attr('r', radius)
        .attr('fill', 'none')
        .attr('stroke', 'black');

    // Variables to use for anchors: stars_count, forks_count, issues_count, pull_requests
    const arrDimension = ['stars_count', 'forks_count', 'issues_count', 'pull_requests'];

    // Scale for each dimension range)
    const objDimScale = arrDimension.reduce((acc, dim) => ({
        ...acc,
        [dim]: d3.scaleLinear().domain(d3.extent(data, d => +d[dim])).range([0, 1])
    }), {});

    // Scaling anchor positions for each dimension
    const scaleAnchors = d3.scaleBand()
        .domain(arrDimension)
        .range([-Math.PI / 4, Math.PI * 7 / 4]);

    // Create anchor lines for each dimension
    const anchors = svg.selectAll('.anchor')
        .data(arrDimension)
        .join('g')
        .attr('class', 'anchor')
        .attr('transform', d => `rotate(${scaleAnchors(d) * 180 / Math.PI}) translate(${radius}, 0)`);

    anchors.append('line')
        .attr('x2', radius / 10)
        .attr('stroke', 'black')
        .attr('stroke-width', 5);
   
    anchors.append('text')
        .attr('x', (d, i) => i > 1 ? -radius / 10 - 10 : radius / 10 + 10)
        .attr('dy', '0.35em')
        .attr('transform', (d, i) => i > 1 ? 'scale(-1)' : '')
        .attr('text-anchor', (d, i) => i > 1 ? 'end' : 'start')
        .text(d => d);

    // Get the unique programming languages
    const languages = [...new Set(data.map(d => d.language))];

    // Update color scale to map languages to colors
    const languageColorScale = d3.scaleOrdinal()
        .domain(['JavaScript', 'Python', 'Other'])
        .range(['#f1c40f', '#3498db', '#95a5a6']);

    const legend = d3.select('#radVizSvg')
        .append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${size / 2 - 100}, 20)`); // Adjust position above RadViz
    
    const legendData = ['JavaScript', 'Python', 'Other'];  // Legend names (may go back and add the total percentages)
    
    legend.selectAll('rect')
        .data(legendData)
        .enter()
        .append('rect')
        .attr('x', (d, i) => i * 100)
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', d => languageColorScale(d));
    
    legend.selectAll('text')
        .data(legendData)
        .enter()
        .append('text')
        .attr('x', (d, i) => i * 100 + 18)
        .attr('y', 10)
        .text(d => d)
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '12px');

    // Render the points based on the data (repositories)
    svg.append('g')
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', d => {
            let numeratorX = 0, denominator = 0;
            arrDimension.forEach(dim => {
                const value = objDimScale[dim](d[dim]);
                const angle = scaleAnchors(dim);
                numeratorX += value * radius * Math.cos(angle);
                denominator += value;
            });
            return numeratorX / denominator;
        })
        .attr('cy', d => {
            let numeratorY = 0, denominator = 0;
            arrDimension.forEach(dim => {
                const value = objDimScale[dim](d[dim]);
                const angle = scaleAnchors(dim);
                numeratorY += value * radius * Math.sin(angle);
                denominator += value;
            });
            return numeratorY / denominator;
        })
        .attr('r', 5)
        .attr('fill', d => {
            if (d.language === 'JavaScript') return languageColorScale('JavaScript');
            else if (d.language === 'Python') return languageColorScale('Python');
            else return languageColorScale('Other');
        })  // Color based on language (JavaScript, Python, Other)
        .attr('fill-opacity', 0.5)
        .on('mouseover', (event, d) => {
            const [x, y] = d3.pointer(event);
            const tooltip = svg.append('text')
                .attr('class', 'tooltip')
                .attr('x', x)
                .attr('y', y)
                .attr('text-anchor', 'start')
                .attr('font-size', 14)
                .attr('fill', 'black');
        
            const lines = [
                `Repo: ${d.repositories}`,
                `Stars: ${d.stars_count}`,
                `Forks: ${d.forks_count}`,
                `Issues: ${d.issues_count}`,
                `PRs: ${d.pull_requests}`,
                `Language: ${d.language}`
            ];
        
            lines.forEach((line, i) => {
                tooltip.append('tspan')
                    .attr('x', x)
                    .attr('dy', i === 0 ? 0 : '1.2em') // space between lines
                    .text(line);
            });
        })
        .on('mouseout', () => {
            svg.selectAll('.tooltip').remove();
        });
});