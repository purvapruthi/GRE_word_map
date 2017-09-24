var w = 1300,
    h = 600,
    fill = d3.scale.category20();

var vis = d3.select("#chart")
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h);

d3.json("words.json", function(json) {
  var force = d3.layout.force()
      .charge(-120)
      .linkDistance(30)
      .nodes(json.nodes)
      .links(json.links)
      .size([w, h])
      .start();

  var link = vis.selectAll("line.link")
      .data(json.links)
    .enter().append("svg:line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); })
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
      .style("visibility", "hidden");

  var node = vis.selectAll(".node")
      .data(json.nodes)
    .enter().append("g")
      .attr("transform", function(d){return "translate("+ ( 1.6*d.x -w*0.3)+","+d.y+")"})
      .call(force.drag)
      .style("visibility", function (d) {
          return d.colour === 'lightblue' ? "visible" : "hidden";
        })
        .on("mouseover", function (d) {
          group_desired = d.group
          node.filter(function (d) { return d.group === group_desired; })
                .style("visibility", "visible");
          node.filter(function (d) { return d.group != group_desired; })
                .style("opacity", 0);
          link.filter(function (d) { return d.source.group === d.target.group && d.source.group === group_desired; })
                .style("visibility", "visible");
          d3.select("#info").text(d.meaning);

        })
        .on("mouseout", function (d) {
          group_desired = d.group
          node.filter(function (d) { return d.group === group_desired && d.colour != 'lightblue'; })
                .style("visibility", "hidden");
          link.filter(function (d) { return d.source.group === d.target.group && d.source.group === group_desired; })
                .style("visibility", "hidden");      
          node.filter(function (d) { return d.group != group_desired; })
                .style("opacity", 1);


        });

  node.append("circle")
     .attr("class", "node")
     .attr("r", function(d) {return d.name.length * 2.5;})
     .style("fill", function(d) { return d3.hsl(d.colour); })

  node.append("text")
    .attr("x", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "10")
    .text(function(d) { return d.name; });

  vis.style("opacity", 1e-6)
    .transition()
      .duration(1000)
      .style("opacity", 1);

  force.on("tick", function() {
    link.attr("x1", function(d) { return 1.6*d.source.x -w*0.3; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return 1.6*d.target.x -w*0.3; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x = Math.max(d.name.length * 2.5, Math.min(w - d.name.length * 2.5, d.x)); }) 
        .attr("cy", function(d) { return d.y = Math.max(d.name.length * 2.5, Math.min(h - d.name.length * 2.5, d.y)); });
    node.attr("transform", function(d){return "translate("+ (1.6*d.x - w*0.3)+","+d.y+")"});
      
    force.stop()
  });
});
