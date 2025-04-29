class Bubble {
  constructor(data, svg, size, con) {
    this.con = con;
    this.data = data;
    this.svg = svg;

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = size.width;
    const height = size.height;

    const filtered = data.filter(d => d.languages_used && d.languages_used !== 'NULL');


    const languageCounts = filtered.reduce((acc, d) => {
      let langs = [];
      try {
        langs = JSON.parse(d.languages_used.replace(/'/g, '"'));
      } catch (err) {
        console.error('Error parsing languages_used', d.languages_used, err);
      }
      langs.forEach(lang => {
        acc[lang] = (acc[lang] || 0) + 1;
      });
      return acc;
    }, {});

    const languageData = Object.entries(languageCounts).map(([language, count]) => ({
      language,
      count,
    }));


    const radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(languageData, d => d.count)])
      .range([15, 25]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(languageData.map(d => d.primary_language));


    svg.append('svg')
      .attr('width', width)
      .attr('height', height);

    const nodes = languageData.map(d => ({
      ...d,
      language: d.language,
      radius: radiusScale(d.count * 10),
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    const languageCountsArray = languageData.map(d => d.count);

    nodes.forEach(node => {
      node.primary_language = node.language;
      node.color = colorScale(node.language);
    });
    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(25))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.radius + 2))
      .on('tick', ticked);

    const node = this.svg.selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => colorScale(d.primary_language))
      .attr('stroke', 'black')
      .attr('opacity', 1)
      .on('mouseover', (event, d) => {

        d3.select(event.currentTarget)
          .attr('stroke-width', 3);

        tooltip
          .style('opacity', 1)
          .html(`Language: ${d.language}<br>Count: ${d.count}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })

      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke-width', 1);
        tooltip.style('opacity', 0);
      })
      .call(d3.drag()
        .on('start', function (event) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on('drag', function (event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on('end', function (event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        })
      );

    function ticked() {
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    }


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
