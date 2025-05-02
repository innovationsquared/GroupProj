class Pie {
    constructor(data, svg, size, con) {
        this.con = con;
        this.data = data;
        this.svg = svg; // Store svg as a property

        const languageCounts = d3.rollups(
            data,
            v => v.length,
            d => d.primary_language || 'Unknown'
        );

        languageCounts.sort((a, b) => b[1] - a[1]);
        
        const topLanguages = languageCounts.slice(0, 7);
        const otherCount = languageCounts.slice(7).reduce((sum, item) => sum + item[1], 0);
        
        if (otherCount > 0) {
            topLanguages.push(['Other', otherCount]);
        }

        const colorScale = d3.scaleOrdinal()
            .domain(topLanguages.map(d => d[0]))
            .range(d3.schemeCategory10);

        const pie = d3.pie()
            .value(d => d[1])
            .sort(null);

        const pieData = pie(topLanguages);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(size.width, size.height) / 2 - 40);

        const slices = svg.selectAll('path.slice')
            .data(pieData)
            .join('path')
            .attr('class', 'slice')
            .attr('d', arc)
            .attr('fill', d => colorScale(d.data[0]))
            .attr('stroke', 'white')
            .style('stroke-width', '2px')
            .style('opacity', 0.8)
            .on('mouseover', (event, d) => {
                d3.select(event.currentTarget)
                    .style('opacity', 1)
                    .style('stroke-width', '3px');
                
                tooltip
                    .style('opacity', 1)
                    .html(`Language: ${d.data[0]}<br>Repositories: ${d.data[1]} (${(d.endAngle - d.startAngle) / (2 * Math.PI) * 100 | 0}%)`)
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 28}px`);
            })
            .on('mouseout', (event) => {
                d3.select(event.currentTarget)
                    .style('opacity', 0.8)
                    .style('stroke-width', '2px');
                tooltip.style('opacity', 0);
            })
            .on('click', (event, d) => {
                this.con.Select(d.data[0]);
            });

        const labelArc = d3.arc()
            .innerRadius(arc.outerRadius()() * 0.6)
            .outerRadius(arc.outerRadius()() * 0.9);

        svg.selectAll('text.label')
            .data(pieData.filter(d => (d.endAngle - d.startAngle) > 0.25))
            .join('text')
            .attr('class', 'label')
            .attr('transform', d => `translate(${labelArc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .text(d => d.data[0])
            .style('font-size', '12px')
            .style('font-weight', 'bold');

        const percentArc = d3.arc()
            .innerRadius(arc.outerRadius()() * 0.4)
            .outerRadius(arc.outerRadius()() * 0.7);

        svg.selectAll('text.percentage')
            .data(pieData.filter(d => (d.endAngle - d.startAngle) > 0.15))
            .join('text')
            .attr('class', 'percentage')
            .attr('transform', d => `translate(${percentArc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .text(d => `${d.data[1]}`)
            .style('font-size', '10px');

        const legend = svg.append('g')
            .attr('transform', `translate(${size.width / 3}, ${-size.height / 2 + 20})`);

        const legendItems = legend.selectAll('.legend-item')
            .data(topLanguages)
            .join('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legendItems.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', d => colorScale(d[0]));

        legendItems.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text(d => `${d[0]} (${d[1]})`)
            .style('font-size', '12px');

        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('text-align', 'center')
            .style('padding', '6px')
            .style('font', '12px sans-serif')
            .style('background', 'lightsteelblue')
            .style('border', '1px')
            .style('border-radius', '8px')
            .style('pointer-events', 'none')
            .style('opacity', 0);
    }

    Highlight(language) {
        this.svg.selectAll('path.slice')
            .style('opacity', d => d.data[0] === language ? 1 : 0.5);
    }
    
    UnHighlight() {
        this.svg.selectAll('path.slice')
            .style('opacity', 0.8);
    }
}