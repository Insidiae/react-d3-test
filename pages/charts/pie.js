import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import * as d3 from 'd3';

import useD3 from '../../lib/useD3';
import chunk from '../../lib/chunk';
import birthData from '../../data/birthData';

const [minYear, maxYear] = d3.extent(birthData, d => d.year);
const width = 600;
const height = 600;

const months = [
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"];

const monthsColorScale = d3.scaleOrdinal()
  .domain(months)
  .range(d3.schemeSet3);

const quartersColorScale = d3.scaleOrdinal()
  .domain(["1st", "2nd", "3rd", "4th"])
  .range(d3.schemeSet3.filter((e, i) => i % 3 === 2));

function updateMonths(currentYear) {
  const monthsData = birthData.filter(d => d.year === currentYear);

  const monthsArcs = d3.pie()
    .value(d => d.births)
    .sort((a, b) => (
      months.indexOf(a.month) - months.indexOf(b.month)
    ))(monthsData);

  const monthsPath = d3.arc()
    .outerRadius(width / 2 - 40)
    .innerRadius(width / 4);

  const monthsChart = d3.select(".months-chart")
    .selectAll(".months-group")
    .data(monthsArcs);

  const g = monthsChart
    .enter()
    .append("g")
    .classed("months-group", true);

  g.append("path");
  g.append("text");

  g.merge(monthsChart)
    .select("path")
      .classed("arc", true)
      .attr("fill", d => monthsColorScale(d.data.month))
      .attr("stroke", "black")
      .attr("d", monthsPath);

  const text = g.merge(monthsChart)
    .select("text")
      .text("")
      .attr("transform", d => `translate(${monthsPath.centroid(d)})`)

  text.append("tspan")
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .text(d => d.data.month.slice(0, 3));
  text.append("tspan")
    .attr("x", 0)
    .attr("y", "1.2em")
    .attr("text-anchor", "middle")
    .text(d => d.data.births);

  // d3.select(".title")
  //   .text(`Births by month and quarter for ${currentYear}`);

  updateQuarters(monthsData);
}

function updateQuarters(monthsData) {
  let quartersData = chunk(monthsData, 3);

  const quartersArcs = d3.pie()
  .value(d => d.births)
  .sort((a,b) => (
    a.quarter - b.quarter
  ))(quartersData);

  const quartersPath = d3.arc()
    .outerRadius(width / 4)
    .innerRadius(0);

  const quartersChart = d3.select(".quarters-chart")
    .selectAll(".quarters-group")
    .data(quartersArcs);

  const g = quartersChart
    .enter()
    .append("g")
    .classed("quarters-group", true);

  g.append("path");
  g.append("text");

  g.merge(quartersChart)
    .select("path")
      .classed("arc", true)
      .attr("fill", d => quartersColorScale(d.data.quarter))
      .attr("stroke", "black")
      .attr("d", quartersPath);

  const text = g.merge(quartersChart)
    .select("text")
      .text("")
      .attr("transform", d => `translate(${quartersPath.centroid(d)})`)

  text.append("tspan")
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .text(d => `${d.data.quarter} Qtr.`);
  text.append("tspan")
    .attr("x", 0)
    .attr("y", "1.2em")
    .attr("text-anchor", "middle")
    .text(d => d.data.births);
}

function PieChart() {
  const [currentYear, setCurrentYear] = useState(minYear)

  useEffect(() => {
    const svg = d3.select("svg");
    svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .classed("months-chart", true);

    svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .classed("quarters-chart", true);

    // svg.append("text")
    //   .classed("title", true)
    //   .attr("x", width / 2)
    //   .attr("y", 30)
    //   .attr("font-size", "2em")
    //   .attr("text-anchor", "middle");
  }, [])

  const ref = useD3(() => {
    updateMonths(currentYear);
  }, [currentYear]);

  return (
    <div>
      <Head>
        <title>Pie Chart: Births by month and quarter for {currentYear}</title>
      </Head>
      <svg
        ref={ref}
        version="1.1"
        baseProfile="full"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
      >
        <text
          className="title"
          x={width / 2}
          y={30}
          fontSize="2em"
          textAnchor="middle"
        >
          Births by month and quarter for {currentYear}
        </text>
      </svg>
      <input
        type="range"
        min={minYear}
        max={maxYear}
        defaultValue={minYear}
        step="1"
        onInput={() => setCurrentYear(+event.target.value)}
      />
    </div>
  );
}

export default PieChart;
