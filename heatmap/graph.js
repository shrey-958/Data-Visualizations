const margin = {top : 10, right:10, bottom:200, left:100}
const graphWidth = 900 - margin.left - margin.right;
const graphHeight = 700 - margin.top - margin.bottom;
const yPad = 10
const months = ["January", "February", "March", "April", 
"May", "June", "July", "August", "September",
 "October", "November", "December"]; 
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 1000)
    .attr('height', 700)

const graph  = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const x = d3.scaleTime().range([0, graphWidth])
//const timeFormatX = d3.timeFormat("%Y");
const y = d3.scaleBand().domain(months).range([ 0, graphHeight ]);  


//const y = d3.scaleOrdinal()
  //      .domain([[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]])
    //    .range([0, graphHeight])
const colour = d3.scaleLinear()
    .range([1,0])

const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`)
    .attr('id', 'x-axis');    
const yAxisGroup = graph.append('g')
    .attr('id', 'y-axis');


d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(data => {
        console.log(data)
        var baseTemp = data.baseTemperature
        var maxVar = d3.max(data.monthlyVariance, d => d.variance)
        var minVar = d3.min(data.monthlyVariance, d => d.variance)
        var maxTemp = baseTemp + maxVar
        var minTemp = baseTemp + minVar
       
        colour.domain([ minTemp, maxTemp])
        console.log(d3.interpolateRdYlBu(colour(baseTemp - 2)))
        console.log(y(1)  + 'hiiiiiiez') 
        x.domain(d3.extent(data.monthlyVariance, d => d.year ))
        const xAxis = d3.axisBottom(x).tickFormat(d3.format('d')).ticks(20);
        const yAxis = d3.axisLeft(y);

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);
    })