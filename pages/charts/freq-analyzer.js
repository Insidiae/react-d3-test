import React from 'react';
import Head from 'next/head';
import * as d3 from 'd3';

const svgWidth = 800;
const svgHeight = 400;
const barPadding = 10;

function getData(phrase) {
  return phrase.split("").reduce((data, cur) => {
    const char = data.find(e => e.character === cur);
    if(!char) data.push({character: cur, count: 1});
    else char.count++;
    return data;
  }, []);
}

function analyze(event) {
  event.preventDefault();
  const input = d3.select('input');
  const phrase = input.property('value');
  const data = getData(phrase);

  const barWidth = svgWidth / data.length - barPadding;

  const letters = d3.select('svg')
    .selectAll('g')
    .data(data, d => d.character);

  letters
    .classed('new', false)
    .exit().remove();

  const letterEnter = letters.enter()
    .append('g')
    .classed('letter', true)
    .classed('new', true);

  letterEnter.append('rect');
  letterEnter.append('text');

  letterEnter.merge(letters)
    .select('rect')
      .attr('width', barWidth)
      .attr('height', d => d.count * 20)
      .attr('x', (d, i) => (barWidth + barPadding) * i)
      .attr('y', (d) => 600 - (d.count * 20));

  letterEnter.merge(letters)
    .select('text')
    .text(d => d.character)
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')
    .attr('x', (d, i) => (barWidth + barPadding) * i + (barWidth / 2))
    .attr('y', (d) => 600 - (d.count * 20));

  d3.select('#phrase')
    .text(`Analysis of: "${phrase}"`);

  d3.select('#count')
    .text(`(New characters: ${letters.enter().nodes().length})`);

  input.property('value', '');
}

function reset() {
  d3.selectAll('.letter').remove();
  d3.select('#phrase').text('');
  d3.select('#count').text('');
}

function FrequencyAnalyzer() {
  return (
    <div>
      <Head>
        <title>Frequency Analyzer</title>
      </Head>
      <header>
        <h1>Frequency Analyzer</h1>
        <form>
          <input type="text" />
          <button
            type="submit"
            onClick={analyze}
          >
            Count the Letters!
          </button>
          <button
            id="reset"
            type="button"
            onClick={reset}
          >
            Reset
          </button>
        </form>
      </header>
      <div>
        <h2 id="phrase"></h2>
        <h4 id="count"></h4>
        <svg id="letters"
          width={svgWidth}
          height={svgHeight}
        ></svg>
      </div>
    </div>
  )
};

export default FrequencyAnalyzer;
