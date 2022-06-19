import fragment from './color-distance/fragment.glsl';
import vertex from './color-distance/vertex.glsl';

import fragment2 from './left-slide-in/fragment.glsl';
import vertex2 from './left-slide-in/vertex.glsl';

import fragment3 from './circle/fragment.glsl';
import vertex3 from './circle/vertex.glsl';

import fragment4 from './dots/fragment.glsl';
import vertex4 from './dots/vertex.glsl';

import fragment5 from './zoom/fragment.glsl';
import vertex5 from './zoom/vertex.glsl';

const effect = (
  name,
  fragment,
  vertex,
  ease = 'slow(0.7,0.7, false)',
  duration = 0.75
) => ({
  name,
  fragment,
  vertex,
  ease,
  duration,
});

export const effects = [
  effect('color distance', fragment, vertex),
  effect('left slide in', fragment2, vertex2),
  effect('circle', fragment3, vertex3),
  effect('dots', fragment4, vertex4, 'sin.in', 0.75),
  effect('zoom', fragment5, vertex5, 'power2.out'),
];
