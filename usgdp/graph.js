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
    const x = d3.scaleBand()
        .range([0, graphWidth])
        .paddingInner(0.1)
        .paddingOuter(0.1);
    
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
        gdp = data.data.map(item => item[1])

        var onlyYears = data.data.map(function(item) {
            var quarter;
            var temp = item[0].substring(5, 7);
            
            if(temp === '01') {
              quarter = 'Q1';
            }
            else if (temp === '04'){
              quarter = 'Q2';
            }
            else if(temp === '07') {
              quarter = 'Q3';
            }
            else if(temp ==='10') {
              quarter = 'Q4';
            }
        
            return item[0].substring(0, 4) + ' ' + quarter
          });
        
        y.domain([d3.max(gdp),0])
        x.domain(years.map(d => d))
        console.log(x.bandwidth())
        console.log(data_main)
        console.log(years)
        console.log(gdp)
        console.log(y(gdp[8]))
        console.log(onlyYears)

        
        const rects = graph.selectAll('rects')
            .data(data_main)

            rects.attr('width', x.bandwidth)
            .attr('height', d => graphHeight - y(d[1]))
            .attr('fill', 'orange')
            .attr('x', d => x(d[0]))
            .attr('y', d => y(d[1]))

            rects.enter()
            .append('rect')
            .attr('width', x.bandwidth)
            .attr('height', d => graphHeight - y(d[1]))
            .attr('fill', 'orange')
            .attr('x', d => x(d[0]))
            .attr('y', d => y(d[1]))

            const xAxis = d3.axisBottom(x);
            const yAxis = d3.axisLeft(y)
                .ticks(5)
                    .tickFormat(d => d );

                    xAxisGroup.call(xAxis);
                    yAxisGroup.call(yAxis);
                
                    xAxisGroup.selectAll('text')
                    .attr('transform', 'rotate(-90)')
                    .attr('text-anchor', 'end')
                    .attr('fill', 'purple');
        

        
    })

    

    
