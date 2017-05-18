$(document).ready(function() {
  $.getJSON(
    "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json",
    function(json) {
      var nodes = json.nodes.map(function(d, i) {
        return [
          {
            name: json.nodes[i].country,
            code: json.nodes[i].code
          }
        ];
      });
      var links = json.links.map(function(d, i) {
        return [
          {
            target: json.links[i].target,
            source: json.links[i].source
          }
        ];
      });

      var dataNodes = [].concat.apply([], nodes);
      var dataLinks = [].concat.apply([], links);

      var w = $("body").width();
      var h = $("body").height();


      var dataset = {
        nodes: dataNodes,
        edges: dataLinks
      };

      var force = d3.layout
        .force()
        .nodes(dataset.nodes)
        .links(dataset.edges)
        .size([w, h])
        .linkDistance([100])
        .charge([-150])
        .start();

      var colors = d3.scale.category10();

      var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      var svg = d3
        .select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      var edges = svg
        .selectAll("line")
        .data(dataset.edges)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", 1);

      var nodes = svg
        .selectAll("circle")
        .data(dataset.nodes)
        .enter()
        .append("circle")
        .attr("r", 20)
        .style("fill", function(d, i) {
          return colors(i);
        })
        .call(force.drag)
        .on("mouseover", function(d) {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(
        "<img class=\"flag flag-"+d.code+"\">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+d.name+"</div>"
            )
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function(d) {
          tooltip.transition().duration(500).style("opacity", 0);
        });

      var label = svg
        .selectAll(".mytext")
        .data(dataset.nodes)
        .enter()
        .append("text")
        .text(function(d) {
          return d.code;
        })
        .style("text-anchor", "middle")
        .style("fill", "#555")
        .style("font-family", "Arial")
        .style("font-size", 12)
        .style("fill", "white");

      force.on("tick", function() {
        edges
          .attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });
        nodes
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          });
        label
          .attr("x", function(d) {
            return d.x;
          })
          .attr("y", function(d) {
            return d.y + 5;
          });
      });
    });
});
