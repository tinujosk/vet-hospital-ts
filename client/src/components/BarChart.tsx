import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ rawData }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });

  const aggregatedData = Object.entries(
    rawData.reduce((acc, curr) => {
      const doctorName = curr.doctor
        ? `${curr.doctor.firstName} ${curr.doctor.lastName}`
        : 'Unknown Doctor';
      acc[doctorName] = (acc[doctorName] || 0) + 1;
      return acc;
    }, {})
  ).map(([doctorName, value]) => ({ doctorName, value }));

  useEffect(() => {
    const updateDimensions = () => {
      const width = containerRef.current.offsetWidth;
      const height = 400;
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    const { width, height } = dimensions;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const x = d3
      .scaleBand()
      .domain(aggregatedData.map(d => d.doctorName))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(aggregatedData, d => d.value)]) // Set the Y-axis domain
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Explicitly setting the Y-axis ticks to integers
    const tickValues = Array.from(
      { length: Math.ceil(d3.max(aggregatedData, d => d.value)) + 1 },
      (_, i) => i
    );

    svg
      .append('g')
      .selectAll('.bar')
      .data(aggregatedData)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.doctorName))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => y(0) - y(d.value))
      .attr('fill', '#69b3a2');

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '12px')
      .style('text-anchor', 'middle');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickValues(tickValues).tickFormat(d3.format('d')));

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.top)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#333');
  }, [aggregatedData, dimensions]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '400px' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;
