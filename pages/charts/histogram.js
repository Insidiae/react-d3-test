import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import * as d3 from 'd3';

import useD3 from '../../lib/useD3';
import regionData from '../../data/regionData';

const width = 800;
const height = 600;
const barPadding = 1;
const padding = 50;
const ageData = regionData.filter(d => !!d.medianAge);

const xScale = d3.scaleLinear()
.domain(d3.extent(ageData, d => d.medianAge))
.rangeRound([padding, width - padding]);

const histogram = d3.bin()
  .domain(xScale.domain())
  .thresholds(xScale.ticks())
  .value(d => d.medianAge);

let bins = histogram(ageData);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(bins, d => d.length)])
  .range([height - padding, padding]);

function initializeChart() {
  d3.select(".x-axis")
    .call(d3.axisBottom(xScale));

  d3.select(".y-axis")
    .call(d3.axisLeft(yScale));
}

function updateBars(binCount) {
  histogram.thresholds(xScale.ticks(binCount));
  bins = histogram(ageData);
  yScale.domain([0, d3.max(bins, d => d.length)]);

  d3.select(".x-axis")
    .call(d3.axisBottom(xScale)
      .ticks(binCount))
    .selectAll("text")
    .attr("x", 10)
    .attr("y", -3)
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");

  d3.select(".y-axis")
    .call(d3.axisLeft(yScale));

  const bars = d3.select("svg")
    .selectAll(".bar")
    .data(bins);

  bars.exit().remove();

  let g = bars
    .enter()
    .append("g")
      .classed("bar", true);

  g.append("rect");
  // g.append("text");

  g.merge(bars)
    .select("rect")
      .attr("x", (d, i) => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("width", d => {
        const barWidth = xScale(d.x1) - xScale(d.x0) - barPadding
        return barWidth > 0 ? barWidth : 0;
      })
      .attr("height", d => height - padding - yScale(d.length))
      .attr("fill", "#588dfd");

  // g.merge(bars)
  //   .select("text")
  //     .text(d => `Median ages ${d.x0} - ${d.x1} (${d.length})`)
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", d => (xScale(d.x1) + xScale(d.x0))/2)
  //     .attr("x", -height + padding + 10)
  //     .style("alignment-baseline", "middle")
  //     .style("font-size", d => `${Math.min(xScale(d.x1) - xScale(d.x0) - barPadding * 2, 48)}px`);

  d3.select(".bin-count")
    .text(`Number of bins: ${bins.length}`);
}

function Histogram() {
  const [binCount, setBinCount] = useState(bins.length);

  useEffect(initializeChart, []);

  const ref = useD3(() => updateBars(binCount), [binCount]);

  return (
    <div>
      <Head>
        <title>Histogram</title>
      </Head>
      <svg
        ref={ref}
        version="1.1"
        baseProfile="full"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
      >
        <text className="title"
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
        >
          Median Age
        </text>
        <g className="x-axis"
          transform={`translate(0, ${height - padding})`}
        ></g>
        <g className="y-axis"
          transform={`translate(${padding}, 0)`}
        ></g>
        <text
          transform="rotate(-90)"
          x={-height / 2}
          y={15}
          textAnchor="middle"
        >
          Frequency
        </text>
      </svg>
      <p className="bin-count"></p>
      <input
        type="range"
        min="1"
        max="50"
        step="1"
        defaultValue={binCount}
        onInput={event => setBinCount(+event.target.value)}
      />
    </div>
  )
};

export default Histogram;
