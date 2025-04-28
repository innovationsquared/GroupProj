class Bubble {
    constructor(data, w, h, con) {
      this.con = con;
      this.data = data;
  
      const margin = { top: 50, right: 50, bottom: 50, left: 50 };
      const width = w - margin.left - margin.right;
      const height = h - margin.top - margin.bottom;
 
      const filtered = data.filter(d => d.language && d.language !== 'NULL');
  
  
      const languageCounts = d3.rollup(
        filtered,
        v => v.length,
        d => d.language
      );
  
      const languageData = Array.from(languageCounts, ([language, count]) => ({
        language,
        count,
      }));
  
      const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(languageData, d => d.count)])
        .range([10, 50]);
  
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(languageData.map(d => d.language));
  
      const svg = d3.select(this.con)
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
        .attr('fill', d => colorScale(d.language))
        .attr('stroke', 'black')
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

        }

        // mouse events for the bubbles to enlarge and information maybe.s
    // just needs to enlarge the bubble that is being hovered.


}
