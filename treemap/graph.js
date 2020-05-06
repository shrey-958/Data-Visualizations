const margin = {top : 10, right:10, bottom:100, left:100}
const graphWidth = 900 - margin.left;
const graphHeight = 700 - margin.top - margin.bottom;

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 1000)
    .attr('height', 700)



const colour = d3.scaleOrdinal(d3.schemeCategory10);

d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json').then(data => {
    console.log(data)
    const treemap = d3.treemap()
        .size([graphWidth, graphHeight])
        .padding(1)
    
    const root = d3.hierarchy(data)
        .sum(d => d.value)
    console.log(root)
    console.log(root.leaves())
    treemap(root)
    const room = svg.selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x0}, ${d.y0})`)
    const rects = room.append('rect')
        .attr('class', 'tile')
        .attr('data-name', d => d.data.name)
        .attr('data-value', d => d.data.value)
        .attr('data-category', d => d.data.category)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => colour(d.data.category))
        .on('mouseover', (d,i,n) => {
            tip.show(d, n[i])
            handlemouseover(d,i,n)
            })
        .on('mouseout', (d,i,n) => {
            tip.hide(d, n[i])
            handlemouseout(d,i,n)
            })
        
    const info = room.append("text")
    .attr('class', 'tile-text')
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter().append("tspan")
    .attr("x", 2)
    .attr("y", (d, i) => 11 + i * 10)
    .text(d => d)
    .style('font-size', 9)
    .style('font-weight', 'bold')

    const lejhends = svg.selectAll('rect')
                .data(root.leaves())
                .attr('id', 'legend')
    const legendElem = lejhends
                .append("g")
                .append("rect") 
                .attr('class', 'legend-item')
                .attr('fill', function(d){
                    return colour(d);
                  })


    const tip = d3.tip()
    .attr("class", "tooltip")
    .attr('id', 'tooltip')
  .attr('class', 'card')
  .html(d => {
      let content = `<p>${d.data.name}</p>`
      content += `<p>${d.data.category}</p>`
      content += `<p>${d.data.value}</b>`
      return content
  })
  

room.call(tip)
const legendGroup = svg.append('g')
  .attr('transform', `translate(${graphWidth + 50}, 100)`)

const legend= d3.legendColor()
  .shape('rect')
  .scale(colour)

legendGroup.call(legend)

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
        
    
})