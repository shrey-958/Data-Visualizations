const margin = {top : 10, right:10, bottom:200, left:100}
const graphWidth = 900 - margin.left - margin.right;
const graphHeight = 700 - margin.top - margin.bottom;

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 1000)
    .attr('height', 700)

const graph  = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const colour = d3.scaleLinear()
    .range([1,0])


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
    })