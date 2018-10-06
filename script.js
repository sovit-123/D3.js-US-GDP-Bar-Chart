//Loading and retrieving of JSON data begins
function loadJSON() {
  var data_file =
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
  var http_request = new XMLHttpRequest();
  try {
    http_request = new XMLHttpRequest();
  } catch (e) {
    console.log(e);
  }

  try {
    http_request.onreadystatechange = function() {
      if (http_request.readyState == 4) {
        // Javascript function JSON.parse to parse JSON data
        var jsonObj = JSON.parse(http_request.responseText);
      }
      createBarChart(jsonObj);
    };
  } catch (e) {
    console.log(e);
  }

  http_request.open('GET', data_file, true);
  http_request.send();
}
//Loading and retrieving of JSON data ends

/*Creating BarChart begins*/
function createBarChart(jsonObj) {
  let gdpFull = [];

  const h = 500,
    w = 1100;

  for (let i = 0; i < 275; i++) {
    gdpFull[i] = [];
    gdpFull[i][0] = jsonObj.data[i][0]; // Date
    gdpFull[i][1] = jsonObj.data[i][1]; // GDP
  }

  let gdp = gdpFull.map(function(item) {
    return item[1];
  });

  let dates = gdpFull.map(function(item) {
    return item[0].substring(0, 4);
  });

  const svgArea = d3
    .select('#bar-chart')
    .append('svg')
    .attr('height', h + 23)
    .attr('width', w + 100);

  let tooltip = d3
    .select('#showInfo')
    .append('div')
    .attr('id', 'tooltip');

  let gdpMin = d3.min(gdp);
  let gdpMax = d3.max(gdp);

  const scale = d3
    .scaleLinear()
    .domain([gdpMin, gdpMax])
    .range([(gdpMin / gdpMax) * h, h]);

  let changedGDP = gdp.map(function(item) {
    return scale(item);
  });

  d3.select('svg')
    .selectAll('rect')
    .data(changedGDP)
    .enter()
    .append('rect')
    .attr('x', (d, i) => {
      return i * 4; //4 =  1100 / 275 = (SVG width  / no. of elements)
    })
    .attr('y', (d, i) => {
      return h - d;
    })
    .attr('class', 'bar')
    .attr('fill', '#67809f')
    .attr('data-date', function(d, i) {
      return gdpFull[i][0];
    })
    .attr('data-gdp', function(d, i) {
      return gdpFull[i][1];
    })
    .style('height', d => d)
    .style('width', 3)
    .attr('transform', 'translate(63, 5)')
    .on('mouseover', function(d, i) {
      tooltip
        .transition()
        .style('opacity', 0.9)
        .duration(100);
      tooltip
        .html(gdpFull[i])
        .attr('data-date', gdpFull[i][0])
        .style('left', i * 4 + 30 + 'px')
        .style('top', h - 100 + 'px')
        .style('transform', 'translateX(100px)');
    })
    .on('mouseout', function() {
      tooltip
        .transition()
        .style('opacity', 0)
        .duration(100);
    });

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(dates), d3.max(dates)])
    .range([0, w]);
  const yScale = d3
    .scaleLinear()
    .domain([gdpMin, gdpMax])
    .range([h, 0]);

  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickFormat(d3.format('d'));
  svgArea
    .append('g')
    .call(xAxis)
    .attr('transform', 'translate(60, 505)')
    .attr('id', 'x-axis');
  const yAxis = d3
    .axisLeft()
    .scale(yScale)
    .tickFormat(d3.format('d'));
  svgArea
    .append('g')
    .call(yAxis)
    .attr('transform', 'translate(60, 5)')
    .attr('id', 'y-axis');
}
/*Creating BarChart ends*/

loadJSON();
