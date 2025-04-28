class Bubble {
    constructor(data, w, h, con) {
      this.con = con;
      this.data = data;
  
      const margin = { top: 50, right: 50, bottom: 50, left: 50 };
      const width = w - margin.left - margin.right;
      const height = h - margin.top - margin.bottom;
 
      const filtered = data.filter(d => d.languages_used && d.languages_used !== 'NULL');
  
      // Parse languages_used arrays
      const languageData = filtered.map(d => {
        let langs = [];
        try {
          langs = JSON.parse(d.languages_used.replace(/'/g, '"'));
        } catch (err) {
          console.error('Error parsing languages_used', d.languages_used, err);
        }
        return {
          name: d.name,
          languages: langs,
          count: langs.length,
          primary_language: d.primary_language || 'Other',
        };
      });

      const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(languageData, d => d.count)])
        .range([10, 50]);
  
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(languageData.map(d => d.primary_language));
  
      const svg = d3.select(this.con.Bubble)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
  
      const nodes = languageData.map(d => ({
        ...d,
        radius: radiusScale(d.count),
        x: Math.random() * width,
        y: Math.random() * height,
      }));
  
      const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(5))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => d.radius + 2))
        .on('tick', ticked);
  
      const node = svg.selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', d => d.radius)
        .attr('fill', d => colorScale(d.primary_language))
        .attr('stroke', 'black')
        .attr('opacity', 0.7)
        .on('mouseover', (event, d) => {
          // On hover: show repo name and languages
          const languagesList = d.languages.join(', ');
          d3.select(event.currentTarget)
            .attr('stroke-width', 3);

          tooltip
            .style('opacity', 1)
            .html(`<strong>${d.name}</strong><br/>Languages: ${languagesList}`)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', (event, d) => {
          d3.select(event.currentTarget)
            .attr('stroke-width', 1);
          tooltip.style('opacity', 0);
        });

      function ticked() {
        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
      }

      // Tooltip div
      const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('text-align', 'center')
        .style('padding', '6px')
        .style('font', '12px sans-serif')
        .style('background', 'lightsteelblue')
        .style('border', '0px')
        .style('border-radius', '8px')
        .style('pointer-events', 'none')
        .style('opacity', 0);
    }
}
