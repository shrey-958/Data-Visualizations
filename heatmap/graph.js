const margin = {top : 10, right:10, bottom:200, left:100}
const graphWidth = 900 - margin.left - margin.right + 300;
const graphHeight = 700 - margin.top - margin.bottom;
const yPad = 10
const months = ["January", "February", "March", "April", 
"May", "June", "July", "August", "September",
 "October", "November", "December"]; 
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 1300)
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
        console.log(data.monthlyVariance)
        
        var baseTemp = data.baseTemperature
        var maxVar = d3.max(data.monthlyVariance, d => d.variance)
        var minVar = d3.min(data.monthlyVariance, d => d.variance)
        var maxTemp = baseTemp + maxVar
        var minTemp = baseTemp + minVar
        const tip = d3.tip()
    .attr('id', 'tooltip')
    .attr('class', 'card')
    .html(d => {
        let content = `<div>${d.year} - ${months[d.month - 1]}</div>`
        var finalTemp = (baseTemp + d.variance).toFixed(2)
        content += `<div>${finalTemp} &#8451;</div>`
        
        return content
    })
    

graph.call(tip)

       
        colour.domain([ minTemp, maxTemp])
        console.log(d3.interpolateRdYlBu(colour(baseTemp - 2)))
        console.log(y(months[1])) 
        x.domain(d3.extent(data.monthlyVariance, d => d.year ))
        const xAxis = d3.axisBottom(x).tickFormat(d3.format('d')).ticks(20);
        const yAxis = d3.axisLeft(y);
        const rectWidth = graphWidth/(data.monthlyVariance.length)
        console.log('len ' + data.monthlyVariance.length)
        const rectHeight = graphHeight/12
        console.log(rectWidth, rectHeight)
        console.log(y(months[3]))

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);
        const rects = graph.selectAll('rects')
            .data(data.monthlyVariance)
            const handlemouseover = (d,i,n) =>{
                d3.select(n[i])
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .style("cursor", "pointer"); 
    
            }
            const handlemouseout = (d,i,n) =>{
                d3.select(n[i])
                    .attr('stroke', 'none')
                    .style("cursor", "default"); 
                    
    
            }


        rects.attr('x', d => x(d.year))
            .attr('y', d => y(months[d.month - 1]) )
            .attr('width', rectWidth )
            .attr('height', rectHeight)
            .attr('fill', d => d3.interpolateRdYlBu( colour(baseTemp + d.variance )))
            .on('mouseover', (d,i,n) => {
                tip.show(d, n[i])
                handlemouseover(d,i,n)
                })
            .on('mouseout', (d,i,n) => {
                tip.hide(d, n[i])
                handlemouseout(d,i,n)
                })
           

        rects.enter()
            .append('rect')
            .attr('x', d => x(d.year) + 1)
            .attr('y', d => y(months[d.month - 1]) )
            .attr('width', rectWidth * 15 )
            .attr('height', rectHeight)
            .attr('fill', d => d3.interpolateRdYlBu( colour(baseTemp + d.variance )))
            .on('mouseover', (d,i,n) => {
                tip.show(d, n[i])
                handlemouseover(d,i,n)
                })
            .on('mouseout', (d,i,n) => {
                tip.hide(d, n[i])
                handlemouseout(d,i,n)
                })
            

    })