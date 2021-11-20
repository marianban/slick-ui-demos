import React from 'react';
import * as d3 from 'd3';
import v4 from 'uuid';

const data = Array.from({ length: 13 }, (_, i) => ({
  id: v4(),
  day: 19 + i,
  temperature: 10 + Math.round(Math.random() * 20)
}));

export const History = () => {
  const yAccessor = d => d.temperature;
  const boundedHeight = 150;

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, yAccessor)])
    .range([0, boundedHeight])
    .nice();

  const extent = d3.extent(data, yAccessor);

  const colorScale = d3
    .scaleLinear()
    .domain(extent)
    .range(['#F1F0F5', '#D3D0E1']);

  const barColorScale = d => {
    const [min, max] = extent;
    const y = yAccessor(d);
    if (y === min) {
      return '#6F32FF';
    }
    if (y === max) {
      return '#FF9066';
    }
    return colorScale(y);
  };

  return (
    <div className="history">
      <h2>Last Days</h2>
      <div className="bar-chart">
        {data.map((d, i) => (
          <React.Fragment key={d.id}>
            <div
              className="bar-chart__bar"
              style={{
                height: yScale(yAccessor(d)),
                backgroundColor: barColorScale(d),
                animationDelay: `${60 * i}ms`
              }}
            />
            <div
              className="bar-chart__bar__label"
              style={{ animationDelay: `${60 * i}ms` }}
            >
              {d.day}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
