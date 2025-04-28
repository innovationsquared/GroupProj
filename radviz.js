// // radviz.js

// // Assuming the dataset is already available in the directory or hosted
// d3.csv('./repository_data.csv').then(data => {

//     const size = 500; // Size of the SVG container (from control.js)
//     const radius = size * 0.3; // Radius of the RadViz circle

//     // May have to change how we are using the SVG from control... this may be local to the file
//     const svg = d3.select('#radVizSvg')
//         .attr('width', size)
//         .attr('height', size)
//         .append('g')
//         .attr('transform', `translate(${size / 2}, ${size / 2})`);

//     const color = d3.scaleOrdinal(d3.schemeCategory10);

//     svg.append('circle')
//         .attr('r', radius)
//         .attr('fill', 'none')
//         .attr('stroke', 'black');

//     // Variables to use for anchors
//     const arrDimension = ['stars_count', 'forks_count', 'commit_count', 'pull_requests'];

//     const objDimScale = arrDimension.reduce((acc, dim) => ({
//         ...acc,
//         [dim]: d3.scaleLinear().domain(d3.extent(data, d => +d[dim])).range([0, 1])
//     }), {});

//     const scaleAnchors = d3.scaleBand()
//         .domain(arrDimension)
//         .range([-Math.PI / 4, Math.PI * 7 / 4]);

//     const anchors = svg.selectAll('.anchor')
//         .data(arrDimension)
//         .join('g')
//         .attr('class', 'anchor')
//         .attr('transform', d => `rotate(${scaleAnchors(d) * 180 / Math.PI}) translate(${radius}, 0)`);

//     anchors.append('line')
//         .attr('x2', radius / 10)
//         .attr('stroke', 'black')
//         .attr('stroke-width', 5);

//     anchors.append('text')
//         .attr('x', (d, i) => i > 1 ? -radius / 10 - 10 : radius / 10 + 10)
//         .attr('dy', '0.35em')
//         .attr('transform', (d, i) => i > 1 ? 'scale(-1)' : '')
//         .attr('text-anchor', (d, i) => i > 1 ? 'end' : 'start')
//         .text(d => d);

//     // Coordinates for the center
//     const centerX = 0;
//     const centerY = 0;

//     // Compute anchor positions
//     const anchorPositions = arrDimension.map(dim => {
//         const angle = scaleAnchors(dim);
//         return {
//             dim,
//             x: radius * Math.cos(angle),
//             y: radius * Math.sin(angle)
//         };
//     });

//     // Draw dashed lines from center to each anchor
//     svg.append('g')
//         .selectAll('line.anchor-line')
//         .data(anchorPositions)
//         .enter()
//         .append('line')
//         .attr('class', 'anchor-line')
//         .attr('x1', centerX)
//         .attr('y1', centerY)
//         .attr('x2', d => d.x)
//         .attr('y2', d => d.y)
//         .attr('stroke', '#999')
//         .attr('stroke-dasharray', '4');

//     // Legend and point color scale
//     const languageColorScale = d3.scaleOrdinal()
//         .domain(['JavaScript', 'Python', 'HTML', 'Java', 'C++', 'Other'])
//         .range(['#f1c40f', '#3498db', '#FF0000', '#FFA500', '#800080', '#95a5a6']);

//     // Defining the legend
//     const legendData = ['JavaScript', 'Python', 'HTML', 'Java', 'C++', 'Other'];

//     let activeLanguages = new Set(legendData);

//     const legend = d3.select('#radVizSvg')
//         .append('g')
//         .attr('class', 'legend')
//         .attr('transform', `translate(${size / 2 - 250}, 20)`);

//         legend.selectAll('rect')
//         .data(legendData)
//         .enter()
//         .append('rect')
//         .attr('x', (d, i) => i * 90)
//         .attr('width', 12)
//         .attr('height', 12)
//         .attr('fill', d => languageColorScale(d))
//         .style('cursor', 'pointer')
//         .on('click', function (event, d) {
//             if (activeLanguages.has(d)) {
//                 activeLanguages.delete(d);
//                 d3.select(this).attr('fill-opacity', 0.3);
//             } else {
//                 activeLanguages.add(d);
//                 d3.select(this).attr('fill-opacity', 1);
//             }
        
//             // Filtering logic
//             svg.selectAll('circle.repo')
//                 .attr('display', circleData => {
//                     const lang = circleData.primary_language;
//                     const langKey = ['JavaScript', 'Python', 'HTML', 'Java', 'C++'].includes(lang) ? lang : 'Other';
//                     return activeLanguages.has(langKey) ? null : 'none';
//                 });
//         });
    
//     // Legend click behavior
//     legend.selectAll('text')
//         .data(legendData)
//         .enter()
//         .append('text')
//         .attr('x', (d, i) => i * 90 + 18)
//         .attr('y', 10)
//         .text(d => d)
//         .attr('alignment-baseline', 'middle')
//         .attr('font-size', '12px')
//         .style('cursor', 'pointer')
//         .on('click', function (event, d) {
//             // Ensures we can click on text or rect
//             legend.selectAll('rect')
//                 .filter(x => x === d)
//                 .dispatch('click');
//         });

//     // Add reset button under the legend
//     legend.append('foreignObject')
//         .attr('x', 200)
//         .attr('y', 30)
//         .attr('width', 120)
//         .attr('height', 40)
//         .append('xhtml:button')
//         .style('font-size', '12px')
//         .style('padding', '4px 8px')
//         .style('cursor', 'pointer')
//         .style('border-radius', '4px')
//         .style('border', '1px solid #ccc')
//         .text('Reset Filters')
//         .on('click', () => {
//             activeLanguages = new Set(legendData); // Reset to all active

//             // Restore opacity on all rects
//             legend.selectAll('rect')
//                 .attr('fill-opacity', 1);

//             // Show all points again
//             svg.selectAll('circle.repo')
//                 .attr('display', null);
//         });

//     svg.append('g')
//         .selectAll('circle')
//         .data(data)
//         .join('circle')
//         .attr('class', 'repo')
//         .attr('cx', d => {
//             let numeratorX = 0, denominator = 0;
//             arrDimension.forEach(dim => {
//                 const value = objDimScale[dim](d[dim]);
//                 const angle = scaleAnchors(dim);
//                 numeratorX += value * radius * Math.cos(angle);
//                 denominator += value;
//             });
//             return numeratorX / denominator;
//         })
//         .attr('cy', d => {
//             let numeratorY = 0, denominator = 0;
//             arrDimension.forEach(dim => {
//                 const value = objDimScale[dim](d[dim]);
//                 const angle = scaleAnchors(dim);
//                 numeratorY += value * radius * Math.sin(angle);
//                 denominator += value;
//             });
//             return numeratorY / denominator;
//         })
//         .attr('r', 3)
//         .attr('fill', d => {
//             if (d.primary_language === 'JavaScript') return languageColorScale('JavaScript');
//             else if (d.primary_language === 'Python') return languageColorScale('Python');
//             else if (d.primary_language === 'HTML') return languageColorScale('HTML');
//             else if (d.primary_language === 'Java') return languageColorScale('Java');
//             else if (d.primary_language === 'C++') return languageColorScale('C++');
//             else return languageColorScale('Other');
//         })
//         .attr('fill-opacity', 0.5)
//         .on('mouseover', (event, d) => {
//             svg.selectAll('circle.repo')
//                 .attr('opacity', o => o === d ? 1 : 0.03);  // Set opacity only for hovered repo

//             const [x, y] = d3.pointer(event);
//             const tooltip = svg.append('text')
//                 .attr('class', 'tooltip')
//                 .attr('x', x)
//                 .attr('y', y)
//                 .attr('text-anchor', 'start')
//                 .attr('font-size', 14)
//                 .attr('fill', 'black');

//             const lines = [
//                 `Repo: ${d.name}`,
//                 `Stars: ${d.stars_count}`,
//                 `Forks: ${d.forks_count}`,
//                 `Commit: ${d.commit_count}`,
//                 `PRs: ${d.pull_requests}`,
//                 `Language: ${d.primary_language}`
//             ];

//             lines.forEach((line, i) => {
//                 tooltip.append('tspan')
//                     .attr('x', x + 20)
//                     .attr('dy', i === 0 ? 0 : '1.2em') // space between lines
//                     .text(line);
//             });
//         })
//         .on('mouseout', () => {
//             svg.selectAll('.tooltip').remove();  // Remove tooltip on mouseout
//             svg.selectAll('circle.repo')
//                 .attr('opacity', 0.5);  // Reset opacity when mouse leaves
//         });

// });
