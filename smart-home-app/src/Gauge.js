import React, { useState } from 'react';
import * as d3 from 'd3';

function Handle({
  angleScale,
  getXFromAngle,
  getYFromAngle,
  pauseIconOffset,
  desiredTemp,
  sequentialScale
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
      return -180 + r;
    }
    return -180 - (90 - r);
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
    >
      <div className="gauge__handle__circle-wrapper">
        <div
          className="gauge__handle__circle"
          style={{ '--temp-color': sequentialScale(desiredTemp) }}
        ></div>
      </div>
    </div>
  );
}

function Ticks({ angleScale, getXFromAngle, getYFromAngle, tickTextOffset }) {
  const lowestTemp = 5;
  const highestTemp = 35;
  const numOfSteps = 31;
  const step = (highestTemp - lowestTemp) / (numOfSteps - 1);
  const mainTickStops = [5, 15, 25];
  const ticks = Array.from({ length: numOfSteps }, (_, i) => ({
    angle: angleScale(lowestTemp + i * step),
    offset: mainTickStops.includes(i) ? 0.2 : 0.1
  }));
  const tickOffset = 1.7;

  const tickText = ['10℃', '20℃', '30℃', '1:23 min left'];

  const mainTicks = ticks
    .filter((_, i) => mainTickStops.includes(i))
    .concat([{ angle: angleScale(0) }]);

  return (
    <g>
      {ticks.map((t, i) => (
        <line
          key={`tick-${i}`}
          className="gauge__tick"
          x1={getXFromAngle(t.angle, tickOffset)}
          x2={getXFromAngle(t.angle, tickOffset + t.offset)}
          y1={getYFromAngle(t.angle, tickOffset)}
          y2={getYFromAngle(t.angle, tickOffset + t.offset)}
        />
      ))}
      {mainTicks.map((t, i) => (
        <text
          key={`maintick-${i}`}
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

  const [desiredTemp, setDesiredTemp] = useState(20);
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
    .domain([35, 5])
    .interpolator(d3.interpolateRainbow);

  const angleScale = d3
    .scaleTime()
    .domain([0, 40])
    .range([Math.PI, 3 * Math.PI]);

  var arcGenerator = d3.arc();

  var greyBgArc = arcGenerator({
    startAngle: angleScale(5),
    endAngle: angleScale(35),
    innerRadius: 60,
    outerRadius: 80
  });

  var leftGradientArc = arcGenerator({
    startAngle: angleScale(20),
    endAngle: angleScale(5),
    innerRadius: 80,
    outerRadius: 82
  });

  var rightGradientArc = arcGenerator({
    startAngle: angleScale(20),
    endAngle: angleScale(35),
    innerRadius: 80,
    outerRadius: 82
  });

  const leftCoverArc = arcGenerator({
    startAngle: angleScale(20),
    endAngle: angleScale(0),
    innerRadius: 80,
    outerRadius: 83
  });

  const rightCoverArc = arcGenerator({
    startAngle: angleScale(20),
    endAngle: angleScale(40),
    innerRadius: 80,
    outerRadius: 83
  });

  const leftGradientId = 'left-gradient';
  const rightGradientId = 'right-gradient';

  const stop = (temp, offset) => ({
    color: sequentialScale(temp),
    temp,
    offset
  });
  const leftGradientStopsItems = [
    stop(20, 0),
    stop(15, 20),
    stop(10, 50),
    stop(7, 75),
    stop(5, 100)
  ];

  const rightGradientStopsItems = [
    stop(20, 0),
    stop(25, 20),
    stop(30, 50),
    stop(32, 75),
    stop(35, 100)
  ];

  const gaugeCircleRadius = 122;
  const tickTextOffset = 2;
  const pauseIconOffset = tickTextOffset - 0.5;
  const pauseIconX = getXFromAngle(angleScale(0), pauseIconOffset);
  const pauseIconY = getYFromAngle(angleScale(0), pauseIconOffset);

  let desiredTempAngle = angleScale(desiredTemp) - 2 * Math.PI;
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
            <linearGradient id={leftGradientId} gradientTransform="rotate(90)">
              {leftGradientStopsItems.map((s, i) => (
                <stop
                  key={`left-${s.temp}`}
                  stopColor={s.color}
                  offset={`${s.offset}%`}
                  data-temp={s.temp}
                />
              ))}
            </linearGradient>
            <linearGradient id={rightGradientId} gradientTransform="rotate(90)">
              {rightGradientStopsItems.map((s, i) => (
                <stop
                  key={`right-${s.temp}`}
                  stopColor={s.color}
                  offset={`${s.offset}%`}
                  data-temp={s.temp}
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
            <path d={greyBgArc} fill="#F1F0F5" />
            {desiredTemp <= 20 && (
              <path d={leftGradientArc} fill={`url(#${leftGradientId})`} />
            )}
            {desiredTemp > 20 && (
              <path d={rightGradientArc} fill={`url(#${rightGradientId})`} />
            )}

            <g
              className="cover-arc"
              style={{
                '--cover-deg': `${desiredTempAngle}rad`
              }}
            >
              <rect x="-50%" y="-50%" width="100%" height="100%" />
              {desiredTemp <= 20 && <path d={leftCoverArc} />}
              {desiredTemp > 20 && <path d={rightCoverArc} />}
            </g>

            <circle
              cx={getXFromAngle(angleScale(currentTemp), 1.6)}
              cy={getYFromAngle(angleScale(currentTemp), 1.6) - 1}
              r="2"
              fill="none"
              stroke={sequentialScale(currentTemp)}
              strokeWidth="2"
            />

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
              <span>{desiredTemp}</span>
              <sup>℃</sup>
            </div>
          </div>
        </div>
        <div
          id="pause-icon"
          style={{
            '--pause-icon-x': `${pauseIconX}px`,
            '--pause-icon-y': `${pauseIconY}px`
          }}
        >
          <i className="fas fa-pause"></i>
        </div>
        <Handle
          angleScale={angleScale}
          getXFromAngle={getXFromAngle}
          getYFromAngle={getYFromAngle}
          pauseIconOffset={pauseIconOffset}
          desiredTemp={desiredTemp}
          sequentialScale={sequentialScale}
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
