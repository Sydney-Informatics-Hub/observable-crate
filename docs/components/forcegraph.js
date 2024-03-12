
import * as d3 from "npm:d3";

const width = 1280;
const height = 800;
const color = d3.scaleOrdinal(d3.schemeCategory10);



export function forcegraph(data) {

        // Copy the data to protect against mutation by d3.forceSimulation.
    const links = data.links.map((d) => Object.create(d));
    const nodes = data.nodes.map((d) => Object.create(d));

    const force = d3.forceManyBody().strength(-20);

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id((d) => d.id))
        .force("charge", force)
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    const link = svg.append("g")
        .attr("stroke", "var(--theme-foreground-faint)")
        .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke-width", 0.3);

    const node = svg.append("g")
        .attr("stroke", "var(--theme-background)")
        .attr("stroke-width", 0.2)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", 10)
        .attr("fill-opacity", 0.5)
        .attr("fill", (d) => color(d.group));
 //       .call(drag(simulation));

    node.append("title")
        .text((d) => d.name);

    function ticked() {
        link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

        node
          .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
    }



    function drag(simulation) {

  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}


    return svg;
}

