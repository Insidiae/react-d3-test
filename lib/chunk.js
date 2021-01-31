import * as d3 from 'd3';

const ordinalRules = new Intl.PluralRules("en", {type: "ordinal"});
const suffixes = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th"
};

const qScale = d3.scaleLinear().domain([0, 12]).rangeRound([1,4]);
function chunk(arr, size) {
  return arr.reduce((acc, e, i) => {
    if (i % size) {
      acc[acc.length - 1].births += e.births;
    } else {
      const quarter = qScale(i + 1);
      acc.push({
        year: e.year,
        quarter: `${quarter}${suffixes[ordinalRules.select(quarter)]}`,
        births: e.births
      });
    }
    return acc;
  }, []);
}

export default chunk;