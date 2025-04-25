class Control {
    constructor(data) {
        /**
         * LAYOUT
         */
        const size = {
            /*
            Define the size of the layout here
            */
            width: 1000,
            height: 2000,
            margin: 10,

            pieSize:{
                width:500,
                height:500
            },
            barSize:{
                width:500,
                height:500
            },
            bubbleSize:{
                width: 1000,
                height:500
            },
            radVizSize:{
                width: 500,
                height: 500
            }
        };

        const offsets = {
            pie: {
                top: 0,
                left: 0
            },
            bar: {
                top: 0,
                left: 500
            },
            bubble: {
                top: 500,
                left: 0
            },
            radViz: {
                top: 1000,
                left: 0
            }
            
        }



        /**
         * SVGS
         * using layout above
         */

        // Create the root container, use <d3 selection>.style to set up the size in CSS
        // It's a public variable. Other classes can access it to append their own div and svg
        
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
        const pieSvg = this.root.append('div')
            .attr('id', 'pie')//tag used for CSS
            .style('width', `${size.pieSize.width}px`)
            .style('height', `${size.pieSize.height}px`)
            .style('position', 'absolute')// offset code added
            .style('left', `${offsets.pie.left}px`)// offset code added
            .style('top', `${offsets.pie.top}px`)// offset code added
        .append('svg')
            .attr('width', size.pieSize.width+size.margin*2)
            .attr('height', size.pieSize.height+size.margin*2)
        .append('g')        // origin to the center of the svg
            .attr('transform', `translate(${size.pieSize.width/2}, ${size.pieSize.width/2})`)
        ;

        /**
         * barSVG
         */
        const barSvg = this.root.append('div')
            .attr('id', 'bar')//tag used for CSS
            .style('width', `${size.barSize.width}px`)
            .style('height', `${size.barSize.height}px`)
            .style('position', 'absolute')// offset code added
            .style('left', `${offsets.bar.left}px`)// offset code added
            .style('top', `${offsets.bar.top}px`)// offset code added
        .append('svg')
            .attr('width', size.barSize.width+size.margin*2)
            .attr('height', size.barSize.height+size.margin*2)
        .append('g')        // origin to the margin offset of the svg
            .attr('transform', `translate(${size.margin}, ${size.margin})`)
        ;
        
        /**
         * bubbleSVG
         */
        const bubbleSvg = this.root.append('div')
            .attr('id', 'bubble')//tag used for CSS
            .style('width', `${size.bubbleSize.width}px`)
            .style('height', `${size.bubbleSize.height}px`)
            .style('position', 'absolute')// offset code added
            .style('left', `${offsets.bubble.left}px`)// offset code added
            .style('top', `${offsets.bubble.top}px`)// offset code added
        .append('svg')
            .attr('width', size.bubbleSize.width+size.margin*2)
            .attr('height', size.bubbleSize.height+size.margin*2)
        .append('g')        // origin to the margin offset of the svg
            .attr('transform', `translate(${size.margin}, ${size.margin})`)
        ;
        
        /**
         * radVizSVG
         */
        const radVizSvg = this.root.append('div')
            .attr('id', 'radViz')//tag used for CSS
            .style('width', `${size.radVizSize.width}px`)
            .style('height', `${size.radVizSize.height}px`)
            .style('position', 'absolute')// offset code added
            .style('left', `${offsets.radViz.left}px`)// offset code added
            .style('top', `${offsets.radViz.top}px`)// offset code added
        .append('svg')
            .attr('width', size.radVizSize.width+size.margin*2)
            .attr('height', size.radVizSize.height+size.margin*2)
        .append('g')        // origin to the center of the svg
            .attr('transform', `translate(${size.radVizSize.width/2}, ${size.radVizSize.width/2})`)
        ;



        /**
         * PUBLIC VARIABLES
         */

        /* 
        Define public variables that can be used with multiple classes, such as color scale, dimension array
        */

        // this.margin = Math.min(size.width, size.height) * 0.1; //margin size seems work with this
        // this.color = d3.scaleOrdinal(d3.schemeCategory10);
        // this.dimensions = ["index","sepal.length","sepal.width","petal.length","petal.width","variety"]
        ;


        /*
         * INSTANTIATE VISUALIZATION CLASSES
         * 
        Create the instance for each class here
        Need to pass data, size, and this control object to each class
        For example, 
            this.Pie = new Pie(data, size, this);
        Set up the CSS for size and layout in the style.css file
        */

        this.Bubble = new Bubble(data, bubbleSvg, this);
        // this.Pie = new Pie(data, pieSvg, this);
        // this.RadViz = new RadViz(data, radVizSvg, this);
        // this.Bar = new Bar(data, barSvg, this);
        
    }



    // /**
    //  * INTERACTION METHODS
    //  */
    // /* 
    // Define methods here to respond to the mouse operation (will be called by each visualization class)
    // When theses methods are called, call corresponding methods in each visualization class to update the chart
    // */
    
    // Select(variety){
    //     if(this.Pie.highlightedColor!=variety){
    //         this.Pie.Highlight(variety);
    //         this.PCord.Filter(variety);
    //         this.RadViz.Filter(variety);
    //     }
    //     else{
    //         this.Pie.UnHighlight();
    //         this.PCord.UnFilter();
    //         this.RadViz.UnFilter();
    //     }
    // }

    // Highlight(index, variety){
    //     this.PCord.Highlight(index);
    //     this.RadViz.Highlight(index);
    //     this.Pie.Highlight(variety);
    // }

    // UnHighlight(){
    //     this.PCord.UnHighlight();
    //     this.RadViz.UnHighlight();
    //     this.Pie.UnHighlight();
    // }

    // ShowParallelCordsTooltip(d){
    //     this.PCord.ShowTooltip(d);
    // }

    // HideParallelCordsTooltip(){
    //     this.PCord.HideTooltip();
    // }
}