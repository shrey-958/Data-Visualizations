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

const x = d3.scaleTime().range([0, graphWidth])

const y = d3.scaleTime().range([0, graphHeight])

const timeFormatY = d3.timeFormat("%M:%S");
const timeFormatX = d3.timeFormat("%Y");

const xAxisGroup = graph.append('g')
                                .attr('transform', `translate(0, ${graphHeight})`)
                                .attr('id', 'x-axis');
const yAxisGroup = graph.append('g')
        .attr('id', 'y-axis');




d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').then(data => {
    console.log(data)

    var parsedTime
    data.forEach(function(d) {
        d.Place = +d.Place;
    
        parsedTime = d.Time.split(':');
        d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
        d.Year = new Date(d.Year,0,1,0,0,0)
      });

      const tip = d3.tip()
    .attr('id', 'tooltip')
    .attr('class', 'card')
    .html(d => {
        let content = `<p>${d.Name}, ${d.Nationality}</p>`
        content += `<p>Time : ${d.Time.toTimeString().slice(3,8)}, Year : ${d.Year.getFullYear()}</p>`
        content += `<p>${d.Doping}</p>`
        return content
    })
    

graph.call(tip)

const handlemouseover = (d,i,n) => {
    d3.select(n[i])
        .attr('r', 12)
        .style("cursor", "pointer");
}
const handlemouseout = (d,i,n) => {
    d3.select(n[i])
        .attr('r', 8)
        .style("cursor", "default");
}
       
      y.domain(d3.extent(data, d => d.Time ))
      console.log(y.domain())
      x.domain(d3.extent(data, d => d.Year ))
     
      console.log(x.domain())
      const xAxis = d3.axisBottom(x).tickFormat(timeFormatX).ticks(15);
      const yAxis = d3.axisLeft(y).tickFormat(timeFormatY).ticks(8);

      xAxisGroup.call(xAxis);
      yAxisGroup.call(yAxis);

      console.log(x.domain())

      const circles = graph.selectAll('circles')
        .data(data)
        .attr('cx', d => x(d.Year) )
        .attr('cy', d => y(d.Time))
        .attr('r',8)
        .attr('fill', d =>  d.Doping === "" ? '#0d6aff' : '#ff6200')
        .attr('stroke', 'black')

    circles.enter()
      .append('circle')
      .attr('cx', d => x(d.Year))
        .attr('cy', d => y(d.Time))
        .attr('r',8)
        .attr('fill', d => d.Doping === "" ? '#0d6aff' : '#ff6200')
        .attr('stroke', 'black')
        .on('mouseover', (d,i,n) => {
            tip.show(d, n[i])
            handlemouseover(d,i,n)
            })
        .on('mouseout', (d,i,n) => {
            tip.hide(d, n[i])
            handlemouseout(d,i,n)
            })
        
      
})

