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

  const [desiredTemp, setDesiredTemp] = useState(9);
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

  const tempDelta = Math.abs(currentTemp - desiredTemp);
  const gradientStops = Math.ceil(tempDelta) + 1;
  const startTemp = Math.min(currentTemp, desiredTemp);
  const gradientTempStep = tempDelta / (gradientStops - 1);
  const tempGradientId = 'temp-gradient';

  const gradientStopsItems = Array.from(
    { length: gradientStops },
    (v, i) => startTemp + i * gradientTempStep
  );

  console.log(d3.extent(gradientStopsItems));
  console.log(gradientStopsItems);

  const gaugeCircleRadius = 122;

  // 15 (40, 234, 141)
  // 16 (58, 242, 120)
  // 17 (82, 246, 103)
  // 18 (111, 246, 91)
  // 19 (143, 244, 87)
  // 20 (175, 240, 91)

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
                  offset={`${i * (100 / (gradientStopsItems.length - 1))}%`}
                  data-color={s}
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
          style={{
            transform: `translate(${pauseIconX}px, ${pauseIconY}px`
          }}
        >
          <i class="fas fa-pause"></i>
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
