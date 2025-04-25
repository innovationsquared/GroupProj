class Pie{
    constructor (data, w, h, con){
        this.con = con;
        this.data = data;

        const size = {
            width: w,
            height: h,
            margin: con.margin,
            padding: con.margin/10
        }
        const svg = con.root.append('div')
            .attr('id', 'pie')
            .style('width', `${size.width}px`)
            .style('height', `${size.height}px`)
        .append('svg')
            .attr('width', size.width)
            .attr('height', size.height)
        .append('g')
            .attr('transform', `translate(${size.width/2}, ${size.height/2})`);

        const arrVariety = Array.from(new Set(data.map(x => x.language)));

        const arrPie = d3.pie().value(d => data.filter(x => x.language === d).length)(arrVariety);
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(size.width, size.height) / 2 - size.margin.top);
        
        this.pie = svg.selectAll('g.slice')
}
}