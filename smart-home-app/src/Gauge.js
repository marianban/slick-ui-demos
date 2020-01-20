import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const Gauge = () => {
  const $gaugeCircle = useRef();
  const width = 200;

  useEffect(() => {
    let dimensions = {
      width: width,
      height: width,
      radius: width / 2,
      margin: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
      }
    };
    dimensions.boundedWidth =
      dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight =
      dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
    dimensions.boundedRadius =
      dimensions.radius -
      (dimensions.margin.left + dimensions.margin.right) / 2;

    const getCoordinatesForAngle = (angle, offset = 1) => [
      Math.cos(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
      Math.sin(angle - Math.PI / 2) * dimensions.boundedRadius * offset
    ];

    const getXFromAngle = (angle, offset = 1.4) =>
      getCoordinatesForAngle(angle, offset)[0];
    const getYFromAngle = (angle, offset = 1.4) =>
      getCoordinatesForAngle(angle, offset)[1];

    const wrapper = d3
      .select('#gauge')
      .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    const bounds = wrapper
      .append('g')
      .style(
        'transform',
        `translate(${dimensions.margin.left +
          dimensions.boundedRadius}px, ${dimensions.margin.top +
          dimensions.boundedRadius}px)`
      );

    // this is in radians
    const quarter = Math.PI / 4;
    const angleScale = d3
      .scaleTime()
      .domain(d3.extent(5, 35))
      .range([quarter, Math.PI * 2 - quarter]);

    var arcGenerator = d3.arc();

    var pathData = arcGenerator({
      startAngle: quarter,
      endAngle: Math.PI * 2 - quarter,
      innerRadius: 60,
      outerRadius: 80
    });

    const gaugeCircleRadius = 122;
    d3.select($gaugeCircle.current)
      .style('width', `${gaugeCircleRadius}px`)
      .style('height', `${gaugeCircleRadius}px`);

    const area = bounds
      .append('path')
      .attr('class', 'area')
      .attr('d', pathData)
      .style('fill', '#F1F0F5');

    const ticks = Array.from({ length: 25 }, (_, i) => ({
      angle: i * (quarter / 4) + Math.PI + quarter,
      offset: [4, 12, 20].includes(i) ? 0.2 : 0.1
    }));
    const ticksGroup = bounds.append('g');
    const tickOffset = 1.7;
    ticksGroup
      .selectAll('line')
      .data(ticks)
      .enter()
      .append('line')
      .attr('class', 'gauge__tick')
      .attr('x1', d => getXFromAngle(d.angle, tickOffset))
      .attr('x2', d => getXFromAngle(d.angle, tickOffset + d.offset))
      .attr('y1', d => getYFromAngle(d.angle, tickOffset))
      .attr('y2', d => getYFromAngle(d.angle, tickOffset + d.offset));
  }, []);

  return (
    <div id="gauge" className="gauge" style={{ width, height: width }}>
      <div className="gauge__circle" ref={$gaugeCircle}>
        <div className="gauge__circle__indicator">
          <div className="gauge__circle__label">Goal</div>
          <div className="gauge__circle__temp">
            30<sup>℃</sup>
          </div>
        </div>
      </div>
    </div>
  );
};
