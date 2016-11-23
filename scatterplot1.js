/* ----------------------------------------------------------------------------
File: scatterplot.js

80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/ 

//Define Margin
    var margin = {top: 80, right: 80, bottom: 50, left: 50},
    width = 950 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d.gdp;}, // data -> value
    xScale = d3.scale.linear().range([0, width]).nice(), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickPadding(2);

// setup y
var yValue = function(d) { return d["epc"];}, // data -> value
    yScale = d3.scale.linear().range([height, 0]).nice(), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left").tickPadding(2);

// setup fill color
var cValue = function(d) { return d.country;},
    color = d3.scale.category10();

    

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
   

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("scatterdata.csv", function(error, data) {

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.gdp = +d.gdp;
    d["epc"] = +d["epc"];
	
//    console.log(d);
  });

  svg.append("rect")
  .attr("width",width)
  .attr("height",height)
  .attr("style","fill:transparent");
	// don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 50)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
      .text("GDP (in Trillion US Dollars) in 2010");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
      .text("Energy Consumption per Capita (in Million BTUs per person)");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r",function(d) { return Math.sqrt(d.total)/.2; })
      .attr("transform",transform)
      //.attr("cx", xMap)
     // .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));}) 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html( d.country + "<br/>" + "Population: "+d.population +" Million"+"<br/>"+"GDP: $" + xValue(d) 
	        +" Trillion"+ "<br/>"  + "EPC: " + yValue(d)+ " Million BTUs" + "<br/>" + "Total: "+ d.total + " Trillion BTUs")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

	
	
//Scale Changes as we Zoom
    var zoom = d3.behavior.zoom()
    .x(xScale)
    .y(yScale)
    .on("zoom", zoomFunction);
   
// Call the function d3.behavior.zoom to Add zoom
	
	svg.call(zoom);
 
// draw legend
 svg.append("rect")
        .attr("x", width-250)
        .attr("y", height-190)
        .attr("width", 220)
        .attr("height", 180)
        .attr("fill", "lightgrey")
        .style("stroke-size", "1px");

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-100)
        .attr("cy", height-175)
        .style("fill", "white");
    
    svg.append("circle")
        .attr("r", 15.8)
        .attr("cx", width-100)
        .attr("cy", height-150)
        .style("fill", "white");

    svg.append("circle")
        .attr("r", 50)
        .attr("cx", width-100)
        .attr("cy", height-80)
        .style("fill", "white");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-172)
        .style("text-anchor", "end")
        .text(" 1 Trillion BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-147)
        .style("text-anchor", "end")
        .text(" 10 Trillion BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-77)
        .style("text-anchor", "end")
        .text(" 100 Trillion BTUs");
    
     svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-15)
        .style("text-anchor", "middle")
        .style("fill", "Green") 
        .attr("font-size", "16px")
        .text("Total Energy Consumption");   
	

 
  
  function zoomFunction() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + xScale(d.gdp) + "," + yScale(d.epc) + ")";
  }
});
