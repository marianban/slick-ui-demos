var btn = document.querySelector('.btn');

btn.addEventListener('click', animate);

var turbulence = d3.select('#turbulence');
var circles = d3.selectAll('.circle');

var duration = 750;
var app = d3.select('.app');
app.style('--duration', duration + 'ms');

function animate() {
  circles.classed('circle-animation', true);
  // safari specific hack
  app.style('filter', 'url(#filter)');

  turbulence
    .attr('baseFrequency', 0.08)
    .transition()
    .duration(duration)
    .attr('baseFrequency', 0.04)
    .transition()
    .duration(duration * 2)
    .attr('baseFrequency', 0)
    .on('end', () => {
      circles.classed('circle-animation', false);
      // force filter rest in safari
      app.style('filter', 'none');
    });
}
