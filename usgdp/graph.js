const margin = {top : 10, right:10, bottom:200, left:100}
const graphWidth = 800 - margin.left - margin.right;
const graphHeight = 700 - margin.top - margin.bottom;


const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 800)
    .attr('height', 700)

const graph  = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const y = d3.scaleLinear()
        .range([0,graphHeight])
    const x = d3.scaleTime()
        .range([0, graphWidth])
        

       
        
   
   
    
var data_main = []
var years = []
var gdp = []


const xAxisGroup = graph.append('g')
                                .attr('transform', `translate(0, ${graphHeight})`);
        const yAxisGroup = graph.append('g');
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(data => {
        data_main = data.data.map(d => d)

         years = data.data.map(item => {
           

    return item[0]
            })
            const tip = d3.tip()
    .attr('id', 'tooltip')
    .html(d => {
        let content = `<div class="year">${d[0].split('-')[0]}</div>`
        var q = 0;
        switch(d[0].split('-')[1]){
            case "01":
                q = 1;
                break;
            case "04":
                q = 2;
                break;
            case "07":
                q = 3;
                break;
            case "10":
                q = 4;
                break;
        }
        content += `<div class="quarter">Q ${q}</div>`
        content += `<div class="gdp_val">GDP - ${d[1]}</div>`

        return content
    })

graph.call(tip)

           
        gdp = data.data.map(item => item[1])

        var minDate = data.data[0][0].substr(0,4);
        minDate = new Date(minDate);
    var maxDate = data.data[data.data.length - 1][0].substr(0,4);
        maxDate = new Date(maxDate);
           
          
        y.domain([d3.max(gdp),0])
        x.domain([minDate, maxDate])
        const handlemouseover = (d,i,n) =>{
            d3.select(n[i])
                .attr('fill', 'red')
                .style("cursor", "pointer"); 

        }
        const handlemouseout = (d,i,n) =>{
            d3.select(n[i])
                .attr('fill', 'orange')
                .style("cursor", "default"); 

        }
      
          
        
        const rects = graph.selectAll('rects')
            .data(data_main)

            console.log(data_main.map(d => [d[0].split('-')[0], d[1]]))
            rects.attr('width', x.bandwidth)
            .attr('height', d => graphHeight - y(d[1]))
            .attr('fill', 'orange')
            .attr('x', d => x(d[0]))
            .attr('y', d => y(d[1]))

            rects.enter()
            .append('rect')
            .attr('width', graphWidth / data_main.length)
            .attr('height', d => graphHeight - y(d[1]))
            .attr('fill', 'orange')
            .attr('x', (d,i) => i * (graphWidth / data_main.length))
            .attr('y', d => y(d[1]))
            .on('mouseover', (d,i,n) => {
                tip.show(d, n[i])
                handlemouseover(d,i,n)
                })
            .on('mouseout', (d,i,n) => {
                tip.hide(d, n[i])
                handlemouseout(d,i,n)
                })

            const xAxis = d3.axisBottom(x)
                
            const yAxis = d3.axisLeft(y)
                .ticks(5)
                    .tickFormat(d => d );

                    xAxisGroup.call(xAxis);
                    yAxisGroup.call(yAxis);

                    yAxisGroup.selectAll('text')
                    .attr('font-size', 15);
                    xAxisGroup.selectAll('text')
                    .attr('transform', 'rotate(-20)')

                    .attr('text-anchor', 'end')
                    .attr('fill', 'purple')
                    .attr('font-size', 15);
        

        
    })

    

    
