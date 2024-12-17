import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const PieChart = ({ rawData }) => {
  const svgRef = useRef(null);

  const aggregatedData = Object.entries(
    rawData.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, value]) => ({ status, value }));

  useEffect(() => {
    const width = 350;
    const height = 350;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3
      .scaleOrdinal()
      .domain(aggregatedData.map(d => d.status))
      .range(d3.schemeSet2);

    const pie = d3.pie().value(d => d.value);
    const dataReady = pie(aggregatedData);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg
      .selectAll('path')
      .data(dataReady)
      .join('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.status))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    svg
      .selectAll('text')
      .data(dataReady)
      .join('text')
      .text(
        d =>
          `${d.data.status}: ${(
            (d.data.value / d3.sum(aggregatedData, d => d.value)) *
            100
          ).toFixed(1)}%`
      )
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', 12)
      .style('fill', '#fff');
  }, [aggregatedData]);

  return <svg ref={svgRef}></svg>;
};

export default PieChart;
