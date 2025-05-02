class Control {
    constructor(data) {
        /**
         * LAYOUT
         */

        /**
         * OFFSET of each visualization
         */
        const offsets = {
            pie: {
                top: 500,
                left: 0
            },
            bar: {
                top: 0,
                left: 0
            },
            bubble: {
                top: 1000,
                left: 0
            },
            radViz: {
                top: 500,
                left: 500
            }  
        }

        /**
         * layout Size
         */
        const size = {
            /*
            Define the size of the layout here
            */
            width: 1000,
            height: 2000,
            margin: 10
        };

        /**
         * VIZUALIZATION SIZES 
         */
        const pieSize ={
            width: size.width/2,
            height: size.width/2
        }
        const barSize ={
            width: size.width,
            height: size.width/2
        }
        const bubbleSize ={
            width: size.width,
            height: size.width/2
        }
        const radVizSize ={
            width: size.width/2,
            height: size.width/2,
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
        const pieSvg = this.root.append('div')
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
        const barSvg = this.root.append('div')
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
        const bubbleSvg = this.root.append('div')
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
        const radVizSvg = this.root.append('div')
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
         * PUBLIC VARIABLES
         */

        /* 
        Define public variables that can be used with multiple classes
        */

        
        ;


        /*
         * INSTANTIATE VISUALIZATION CLASSES
         * 
        Create the instance for each class here
        Need to pass data, size, and this control object to each class
        For example, 
            this.Pie = new Pie(data, svg, size, this);
        Set up the CSS for size and layout in the style.css file
        */

        this.Bubble = new Bubble(data, bubbleSvg, unpaded_bubbleSize, this);
        this.Pie = new Pie(data, pieSvg, unpaded_pieSize, this);
        this.RadViz = new RadViz(data, radVizSvg, unpaded_radVizSize, this);
        this.Bar = new Bar(data, barSvg, unpaded_barSize, this);
        
    }



    // /**
    //  * INTERACTION METHODS
    //  */
    // /* 
    // Define methods here to respond to the mouse operation (will be called by each visualization class)
    // When theses methods are called, call corresponding methods in each visualization class to update the chart
    // */
    
    Select(variety){
        if(this.Pie.highlightedColor!=variety){
            this.Pie.Highlight(variety);
            // this.PCord.Filter(variety); // Comment out or remove
            this.RadViz.Filter(variety); 
        }
        else{
            this.Pie.UnHighlight();
            // this.PCord.UnFilter(); // Comment out or remove
            this.RadViz.UnFilter();
        }
    }

    Highlight(index, variety){
        //this.PCord.Highlight(index);
        this.RadViz.Highlight(index);
        this.Pie.Highlight(variety);
    }

    UnHighlight(){
        //this.PCord.UnHighlight();
        this.RadViz.UnHighlight();
        this.Pie.UnHighlight();
    }

    // ShowParallelCordsTooltip(d){
    //     this.PCord.ShowTooltip(d);
    // }

    // HideParallelCordsTooltip(){
    //     this.PCord.HideTooltip();
    // }
}