const margin = {top : 10, right:10, bottom:200, left:100}
const graphWidth = 900 - margin.left - margin.right;
const graphHeight = 700 - margin.top - margin.bottom;

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 1000)
    .attr('height', 800)





const EDU_FILE = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const COUN_FILE = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'


var files = [EDU_FILE, COUN_FILE];
var promises = [];

files.forEach(function(url) {
    promises.push(d3.json(url))
});

Promise.all(promises).then(function(values) {
    const education = values[0];
    const us = values[1]
    console.log(topojson.feature(us, us.objects.counties).features)
    const bachVal = d3.extent(education, e => e.bachelorsOrHigher)
    console.log(bachVal)
    const colorSize = 9
    const colour = d3.scaleThreshold()
        .domain(d3.range(bachVal[0], bachVal[1], (bachVal[1] - bachVal[0])/(colorSize - 1)))
        .range(d3.schemePurples[colorSize])
    
        var x = d3.scaleLinear()
        .domain([bachVal[0],  bachVal[1]])
        .rangeRound([560, 800]);
        var g = svg.append("g")
        .attr("class", "key")
        .attr("id", "legend")
        .attr("transform", "translate(0,30)");
    
    g.selectAll("rect")
      .data(colour.range().map(d => {
          d = colour.invertExtent(d);
          if (d[0] == null) d[0] = x.domain()[0];
          if (d[1] == null) d[1] = x.domain()[1];
          return d;
        }))
      .enter().append("rect")
        .attr("height", 8)
        .attr("x", d =>  x(d[0]))
        .attr("width", d => x(d[1]) - x(d[0]) )
        .attr("fill", d => colour(d[0]))
       
    
    g.append("text")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
    
    g.call(d3.axisBottom(x)
        .tickSize(11)
        .tickFormat(x => Math.round(x) + '%')
        .tickValues(colour.domain()))
        .select(".domain")
        .remove();

    const paths = svg.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .enter().append("path")
      .attr("class", "county")
      .attr('d', d3.geoPath())
      .attr('fill', d => {
        var result = education.filter( obj  => {
            return obj.fips == d.id;
          });
          if(result[0]){
              console.log(result[0].bachelorsOrHigher)
            return colour(result[0].bachelorsOrHigher)
          }
          //could not find a matching fips id in the data
          console.log('could find data for: ', d.id);
          return 0

      })
      .attr("data-fips", d => d.id)
      .attr("data-education", d => {
        var result = education.filter( obj  => {
          return obj.fips == d.id;
        });
        if(result[0]){
            console.log(result[0].bachelorsOrHigher)
          return result[0].bachelorsOrHigher
        }
        //could not find a matching fips id in the data
        console.log('could find data for: ', d.id);
        return 0
       })
       .on('mouseover', (d,i,n) => {
        tip.show(d, n[i])
        handlemouseover(d,i,n)
        })
    .on('mouseout', (d,i,n) => {
        tip.hide(d, n[i])
        handlemouseout(d,i,n)
        })

        const tip = d3.tip()
        .attr("class", "tooltip")
        .attr('id', 'tooltip')
      .attr('class', 'card')
      .html(d => {
        var result = education.filter( obj  => {
            return obj.fips == d.id;
          });
          let content = `<div>${result[0].area_name}</div>`
          content += `<div>${result[0].state}</div>`
          content += `<div>${result[0].bachelorsOrHigher} %</div>`
         
          return content
      })
      
  
  paths.call(tip)
  
  const handlemouseover = (d,i,n) => {
      d3.select(n[i])
          .style("cursor", "pointer");
  }
  const handlemouseout = (d,i,n) => {
      d3.select(n[i])
          .style("cursor", "default");
  }

  
    

     
});
