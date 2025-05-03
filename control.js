/**
 * Control Class
 * Written by: Zachary StPierre
 */

/**
 * LAYOUT
 */

/**
 * layout Size
 */
const size = {
    /*
    Define the size of the layout here
    */
    width: 1750,
    height: 2000,
    margin: 10
};

/**
 * VIZUALIZATION SIZES 
 */
const pieSize ={
    width: size.width/3,
    height: size.width/3
}
const barSize ={
    width: size.width*2/3,
    height: size.width/3
}
const bubbleSize ={
    width: size.width*2/3,
    height: size.width/3
}
const radVizSize ={
    width: size.width/3,
    height: size.width/3,
}

/**
 * OFFSET of each element
 */
const HeaderHeight = 25; // height of the header
const offsets = {
    pie: {
        top: HeaderHeight+0,
        left: barSize.width
    },
    bar: {
        top: HeaderHeight+0,
        left: 0
    },
    bubble: {
        top:HeaderHeight+barSize.height,
        left: 0
    },
    radViz: {
        top: HeaderHeight+pieSize.height,
        left: bubbleSize.width
    }  
}

/**
 * margins
 */
const margins = {
    pie:{
        top: size.margin,
        bottom : size.margin,
        left: size.margin,
        right : size.margin
    },
    bar:{
        top: size.margin,
        bottom : size.margin * 12,
        left: size.margin * 2.5,
        right : size.margin
    },
    bubble:{
        top: size.margin,
        bottom : size.margin,
        left: size.margin,
        right : size.margin
    },
    radViz:{
        top: size.margin,
        bottom : size.margin,
        left: size.margin,
        right : size.margin
    }
}

/**
 * unpaded sizes
 */
const unpaded_pieSize ={
    width: pieSize.width - margins.pie.left - margins.pie.right,
    height: pieSize.height - margins.pie.top - margins.pie.bottom
}
const unpaded_barSize ={
    width: barSize.width - margins.bar.left - margins.bar.right,
    height: barSize.height - margins.bar.top - margins.bar.bottom,
}
const unpaded_bubbleSize ={
    width: bubbleSize.width - margins.bubble.left - margins.bubble.right,
    height: bubbleSize.height - margins.bubble.top - margins.bubble.bottom,
}
const unpaded_radVizSize ={
    width: radVizSize.width - margins.radViz.left - margins.radViz.right,
    height: radVizSize.height - margins.radViz.top - margins.radViz.bottom,
}

class Control {
    constructor(data) {
        /**
         * Public Variables
         */
        this.data = data

        /**
         * SVGS
         * using layout above
         */
        
        /**
         * root
         */
        this.root = d3.select('body').append('div')
            .attr('id', 'root')
            .style('width', `${size.width}px`)
            .style('height', `${size.height}px`)
            .style('position', 'relative')// parent needs to be non static for absolute offsets of children to work
        ;

        /**
         * pieSVG
         */
        this.pieSvg = this.root.append('div')
            .attr('id', 'pie')//tag used for CSS
            .style('width', `${pieSize.width}px`)
            .style('height', `${pieSize.height}px`)
            .style('position', 'absolute')// offset code added
            .style('left', `${offsets.pie.left}px`)// offset code added
            .style('top', `${offsets.pie.top}px`)// offset code added
        .append('svg')
            .attr('width', pieSize.width)
            .attr('height', pieSize.height)
        .append('g')        // origin to the center of the svg
            .attr('transform', `translate(${pieSize.width/2}, ${pieSize.width/2})`)
        ;

        /**
         * barSVG
         */
        this.barSvg = this.root.append('div')
            .attr('id', 'bar')//tag used for CSS
            .style('width', `${barSize.width}px`)
            .style('height', `${barSize.height}px`)
            .style('position', 'absolute')// offset code added
            .style('left', `${offsets.bar.left}px`)// offset code added
            .style('top', `${offsets.bar.top}px`)// offset code added
        .append('svg')
            .attr('width', barSize.width)
            .attr('height', barSize.height)
        .append('g')        // origin to the margin offset of the svg
            .attr('transform', `translate(${margins.bar.left}, ${margins.bar.top})`)
        ;
        
        /**
         * bubbleSVG
         */
        this.bubbleSvg = this.root.append('div')
            .attr('id', 'bubble')//tag used for CSS
            .style('width', `${bubbleSize.width}px`)
            .style('height', `${bubbleSize.height}px`)
            .style('position', 'absolute')// offset code added
            .style('left', `${offsets.bubble.left}px`)// offset code added
            .style('top', `${offsets.bubble.top}px`)// offset code added
        .append('svg')
            .attr('width', bubbleSize.width)
            .attr('height', bubbleSize.height)
        .append('g')        // origin to the margin offset of the svg
            .attr('transform', `translate(${margins.bubble.left}, ${margins.bubble.top})`)
        ;
        
        /**
         * radVizSVG
         */
        this.radVizSvg = this.root.append('div')
            .attr('id', 'radViz')//tag used for CSS
            .style('width', `${radVizSize.width}px`)
            .style('height', `${radVizSize.height}px`)
            .style('position', 'absolute')// offset code added
            .style('left', `${offsets.radViz.left}px`)// offset code added
            .style('top', `${offsets.radViz.top}px`)// offset code added
        .append('svg')
            .attr('width', radVizSize.width)
            .attr('height', radVizSize.height)
        .append('g')        // origin to the center of the svg
            .attr('transform', `translate(${radVizSize.width/2}, ${radVizSize.width/2})`)
        ;

        /**
         * RESET BUTTON
         */
        this.root.append('button')
            .attr('id', 'reset')//tag used for CSS
            .style('position', 'absolute')// offset code added
            .style('left', `${0}px`)// offset code added
            .style('top', `${0}px`)// offset code added
            .text('Reset')
            .on('click', () => {
                this.Render(this.data); // call the render method to create the visualizations
            })

        /**
         * PUBLIC VARIABLES
         */

        /* 
        Define public variables that can be used with multiple classes
        */
        
        ;       
        
        this.Render(data); // call the render method to create the visualizations
    }


    Render(data){
        /*
         * Render VISUALIZATION CLASSES
         * 
        Create the instance for each class here
        Need to pass data, svg, size, and this control object to each class
        For example, 
            this.Pie = new Pie(data, this.svg, size, this);
        */

        d3.selectAll('.render').remove(); // remove all previous renderings
        d3.selectAll('.tooltip').remove(); // remove all previous tooltips

        //append tags to make un-rendering easier
        let render_pieSvg = this.pieSvg
        .append('g')
            .attr('id', 'pieRender')
            .attr('class', 'render')
        ;
        let render_barSvg = this.barSvg
        .append('g')
            .attr('id', 'barRender')
            .attr('class', 'render')
        ;
        let render_bubbleSvg = this.bubbleSvg
        .append('g')
            .attr('id', 'bubbleRender')
            .attr('class', 'render')
        ;
        let render_radVizSvg = this.radVizSvg
        .append('g')
            .attr('id', 'radVizRender')
            .attr('class', 'render')
        ;


        new Bubble(data, render_bubbleSvg, unpaded_bubbleSize, this);
        new Pie(data, render_pieSvg, unpaded_pieSize, this);
        new RadViz(data, render_radVizSvg, unpaded_radVizSize, this);
        new Bar(data, render_barSvg, unpaded_barSize, this);
    }


    /**
     * INTERACTION METHODS
     */
    /* 
    These methods are called from the visualization classes to update the data and redraw the visualizations
    */
    
    filterByName(name){
        const filteredData = this.data.filter((dataItem) => dataItem.name === name);
        this.Render(filteredData);
    }
    filterByLanguagesUsed(lang){
        const filteredData = this.data.filter((dataItem) => dataItem.languages_used.includes(lang));
        this.Render(filteredData);
    }
    filterByLanguage(lang){
        const filteredData = this.data.filter((dataItem) => dataItem.primary_language === lang);
        this.Render(filteredData);
    }
    filterByLicense(license){
        const filteredData = this.data.filter((dataItem) => dataItem.licence === license);
        this.Render(filteredData);
    }
}