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
   
    

    const paths = svg.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .enter().append("path")
      .attr("class", "county")
      .attr('d', d3.geoPath())
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
          content += `<div>${result[0].bachelorsOrHigher}</div>`
         
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
