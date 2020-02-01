import React, { useState } from 'react';
import * as d3 from 'd3';

function Handle({
  angleScale,
  getXFromAngle,
  getYFromAngle,
  pauseIconOffset,
  desiredTemp
}) {
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

  return (
    <div
      className="gauge__handle"
      style={{
        '--handle-x': `${handleX}px`,
        '--handle-y': `${handleY}px`,
        '--handle-angle': `${handleAngleDeg}deg`
      }}
    ></div>
  );
}

function Ticks({ angleScale, getXFromAngle, getYFromAngle, tickTextOffset }) {
  const lowestTemp = 5;
  const highestTemp = 35;
  const step = (highestTemp - lowestTemp) / 24;
  const ticks = Array.from({ length: 25 }, (_, i) => ({
    angle: angleScale(lowestTemp + i * step),
    offset: [4, 12, 20].includes(i) ? 0.2 : 0.1
  }));
  const tickOffset = 1.7;

  const tickText = ['10℃', '20℃', '30℃', '1:23 min left'];

  const mainTicks = ticks
    .filter((_, i) => [4, 12, 20].includes(i))
    .concat([{ angle: angleScale(0) }]);

  return (
    <g>
      {ticks.map(t => (
        <line
          className="gauge__tick"
          x1={getXFromAngle(t.angle, tickOffset)}
          x2={getXFromAngle(t.angle, tickOffset + t.offset)}
          y1={getYFromAngle(t.angle, tickOffset)}
          y2={getYFromAngle(t.angle, tickOffset + t.offset)}
        />
      ))}
      {mainTicks.map((t, i) => (
        <text
          className={`gauge__tick__text gauge__tick__text--${i + 1}`}
          x={getXFromAngle(t.angle, tickTextOffset)}
          y={getYFromAngle(t.angle, tickTextOffset)}
        >
          {tickText[i]}
        </text>
      ))}
    </g>
  );
}

export const Gauge = () => {
  const width = 200;

  const [desiredTemp, setDesiredTemp] = useState(30);
  const currentTemp = 20;

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
    dimensions.radius - (dimensions.margin.left + dimensions.margin.right) / 2;

  const getCoordinatesForAngle = (angle, offset = 1) => [
    Math.cos(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
    Math.sin(angle - Math.PI / 2) * dimensions.boundedRadius * offset
  ];

  const getXFromAngle = (angle, offset = 1.4) =>
    getCoordinatesForAngle(angle, offset)[0];
  const getYFromAngle = (angle, offset = 1.4) =>
    getCoordinatesForAngle(angle, offset)[1];
  const sequentialScale = d3
    .scaleSequential()
    .domain([40, 0])
    .interpolator(d3.interpolateRainbow);

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

  var valueArc = arcGenerator({
    startAngle: angleScale(currentTemp),
    endAngle: angleScale(desiredTemp),
    innerRadius: 80,
    outerRadius: 82
  });

  const tickTextOffset = 2;

  const gradientStops = 40;
  const tempDelta = Math.abs(currentTemp - desiredTemp);
  const gradientTempStep = tempDelta / gradientStops;
  const tempGradientId = 'temp-gradient';
  const gradientStopsItems = Array.from(
    { length: gradientStops + 1 },
    (v, i) => currentTemp + i * gradientTempStep
  );

  const gaugeCircleRadius = 122;

  const pauseIconOffset = tickTextOffset - 0.5;
  const pauseIconX = getXFromAngle(angleScale(0), pauseIconOffset);
  const pauseIconY = getYFromAngle(angleScale(0), pauseIconOffset);

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
      <div className="gauge">
        <svg width={dimensions.width} height={dimensions.height}>
          <defs>
            <linearGradient id={tempGradientId}>
              {gradientStopsItems.map((s, i) => (
                <stop
                  stopColor={sequentialScale(s)}
                  offset={`${i * (100 / 40)}%`}
                />
              ))}
            </linearGradient>
          </defs>
          <g
            style={{
              transform: `translate(${dimensions.margin.left +
                dimensions.boundedRadius}px, ${dimensions.margin.top +
                dimensions.boundedRadius}px)`
            }}
          >
            <path d={pathData} fill="#F1F0F5" />
            <path d={valueArc} fill={`url(#${tempGradientId})`} />
            <Ticks
              angleScale={angleScale}
              getXFromAngle={getXFromAngle}
              getYFromAngle={getYFromAngle}
              tickTextOffset={tickTextOffset}
            />
          </g>
        </svg>
        <div
          className="gauge__circle"
          style={{
            width: `${gaugeCircleRadius}px`,
            height: `${gaugeCircleRadius}px`
          }}
        >
          <div className="gauge__circle__indicator">
            <div className="gauge__circle__label">Goal</div>
            <div className="gauge__circle__temp">
              30<sup>℃</sup>
            </div>
          </div>
        </div>
        <div
          id="pause-icon"
          style={{ transform: `translate(${pauseIconX}px, ${pauseIconY}px` }}
        >
          <i class="fas fa-pause"></i>
        </div>
        <Handle
          angleScale={angleScale}
          getXFromAngle={getXFromAngle}
          getYFromAngle={getYFromAngle}
          pauseIconOffset={pauseIconOffset}
          desiredTemp={desiredTemp}
        />
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
