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
      .attr("class", "tooltip")
      .attr('id', 'tooltip')
    .attr('class', 'card')
    .html(d => {
        let content = `<p><b>${d.Name}</b>, ${d.Nationality}</p>`
        content += `<p>Time : ${d.Time.toTimeString().slice(3,8)}, Year : ${d.Year.getFullYear()}</p>`
        content += `<p><b>${d.Doping}</p></b>`
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

      graph.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -250)
    .attr('y', -80)
    .style('font-size', 24)
    .text('Time in Minutes');

      const circles = graph.selectAll('circles')
        .data(data)
        .attr('class', 'dot')
        .attr('cx', d => x(d.Year) )
        .attr('cy', d => y(d.Time))
        .attr("data-xvalue", function(d){
            return d.Year;
          })
          .attr("data-yvalue", function(d){
            return d.Time;
          })
        .attr('r',8)
        .attr('fill', d =>  d.Doping === "" ? '#0d6aff' : '#ff6200')
        .attr('stroke', 'black')

    circles.enter()
      .append('circle')
      .attr('class', 'dot')
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

            yAxisGroup.selectAll('text')
            .attr('fill', 'black')
            .attr('font-size', 15);
            xAxisGroup.selectAll('text')
            .attr('text-anchor', 'end')
            .attr('fill', 'black')
            .attr('font-size', 12);

     
            var legend1 = graph.append('g')
            .attr('transform', 'translate('+(graphWidth - 150)+', '+ ( 100) +')')
            
            legend1.append('rect')
            .attr('height', 16)
            .attr('width', 16)
            .attr('fill', '#ff6200')
            
            legend1.append('text')
            .attr('id', 'legend')
            .attr('transform', 'translate(18,14)')
            .text('Riders with doping allegations')
          
          var legend2 = graph.append('g')
            .attr('transform', 'translate('+(graphWidth - 150)+', '+ ( 125) +')')
            
            legend2.append('rect')
            .attr('height', 16)
            .attr('width', 16)
            .attr('fill', '#0d6aff')
            
            legend2.append('text')
            .attr('transform', 'translate(18,14)')
            .text('No doping allegations')
            
         
        
      
})

