import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export const Gauge = () => {
  const $gaugeCircle = useRef();
  const $pauseIcon = useRef();
  const $handle = useRef();
  const width = 200;

  const [desiredTemp, setDesiredTemp] = useState(30);
  const currentTemp = 20;

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

    const defs = wrapper.append('defs');
    const tempGradientId = 'temp-gradient';

    const sequentialScale = d3
      .scaleSequential()
      .domain([40, 0])
      .interpolator(d3.interpolateRainbow);

    const gradientStops = 40;
    const tempDelta = Math.abs(currentTemp - desiredTemp);
    const gradientTempStep = tempDelta / gradientStops;
    defs
      .append('linearGradient')
      .attr('id', tempGradientId)
      .selectAll('stop')
      .data(
        Array.from(
          { length: gradientStops + 1 },
          (v, i) => currentTemp + i * gradientTempStep
        )
      )
      .enter()
      .append('stop')
      .attr('stop-color', d => sequentialScale(d))
      .attr('offset', (d, i) => `${i * (100 / 40)}%`);

    const bounds = wrapper
      .append('g')
      .style(
        'transform',
        `translate(${dimensions.margin.left +
          dimensions.boundedRadius}px, ${dimensions.margin.top +
          dimensions.boundedRadius}px)`
      );

    const gaugeCircleRadius = 122;
    d3.select($gaugeCircle.current)
      .style('width', `${gaugeCircleRadius}px`)
      .style('height', `${gaugeCircleRadius}px`);

    // this is in radians
    const angleScale = d3
      .scaleTime()
      .domain([0, 40])
      .range([Math.PI, 3 * Math.PI]);

    var arcGenerator = d3.arc();

    var pathData = arcGenerator({
      startAngle: angleScale(5),
      endAngle: angleScale(35),
      innerRadius: 60,
      outerRadius: 80
    });

    bounds
      .append('path')
      .attr('d', pathData)
      .style('fill', '#F1F0F5');

    var valueArc = arcGenerator({
      startAngle: angleScale(currentTemp),
      endAngle: angleScale(desiredTemp),
      innerRadius: 80,
      outerRadius: 82
    });

    bounds
      .append('path')
      .attr('d', valueArc)
      .style('fill', `url(#${tempGradientId})`);

    const lowestTemp = 5;
    const highestTemp = 35;
    const step = (highestTemp - lowestTemp) / 24;
    const ticks = Array.from({ length: 25 }, (_, i) => ({
      angle: angleScale(lowestTemp + i * step),
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

    const tickText = ['10℃', '20℃', '30℃', '1:23 min left'];
    const tickTextOffset = 2;
    ticksGroup
      .selectAll('text')
      .data(
        ticks
          .filter((_, i) => [4, 12, 20].includes(i))
          .concat([{ angle: angleScale(0) }])
      )
      .enter()
      .append('text')
      .attr('x', d => getXFromAngle(d.angle, tickTextOffset))
      .attr('y', d => getYFromAngle(d.angle, tickTextOffset))
      .attr('class', (_, i) => `gauge__tick__text gauge__tick__text--${i + 1}`)
      .text((_, i) => tickText[i]);

    const pauseIconOffset = tickTextOffset - 0.5;
    const pauseIconX = getXFromAngle(angleScale(0), pauseIconOffset);
    const pauseIconY = getYFromAngle(angleScale(0), pauseIconOffset);

    d3.select($pauseIcon.current).style(
      'transform',
      `translate(${pauseIconX}px, ${pauseIconY}px`
    );

    const handleAngle = angleScale(desiredTemp);
    const handleX = getXFromAngle(handleAngle, pauseIconOffset);
    const handleY = getYFromAngle(handleAngle, pauseIconOffset);
    const angleScaleRad = value => angleScale(value) * (180 / Math.PI);
    const computeAngle = value => {
      const r = angleScaleRad(value) % 90;
      if (value >= 30) {
        return r;
      }
      if (value >= 20) {
        return -(90 - r);
      }
      if (value >= 10) {
        return 185 + r;
      }
      return 180 - (90 - r);
    };
    const handleAngleDeg = computeAngle(desiredTemp);
    d3.select($handle.current)
      .style('--handle-x', `${handleX}px`)
      .style('--handle-y', `${handleY}px`)
      .style('--handle-angle', `${handleAngleDeg}deg`);
  }, [desiredTemp]);

  return (
    <>
      <button
        className="btn btn--grey"
        onClick={() => {
          setDesiredTemp(desiredTemp => Math.max(5, desiredTemp - 1));
        }}
      >
        {' '}
        -
      </button>
      <div id="gauge" className="gauge" style={{ width, height: width }}>
        <div className="gauge__circle" ref={$gaugeCircle}>
          <div className="gauge__circle__indicator">
            <div className="gauge__circle__label">Goal</div>
            <div className="gauge__circle__temp">
              30<sup>℃</sup>
            </div>
          </div>
        </div>
        <div id="pause-icon" ref={$pauseIcon}>
          <i class="fas fa-pause"></i>
        </div>
        <div className="gauge__handle" ref={$handle}></div>
      </div>
      <button
        className="btn btn--grey"
        onClick={() => {
          setDesiredTemp(desiredTemp => Math.min(35, desiredTemp + 1));
        }}
      >
        +
      </button>
    </>
  );
};
