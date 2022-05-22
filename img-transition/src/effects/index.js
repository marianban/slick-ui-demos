import fragment from './color-distance/fragment.glsl';
import vertex from './color-distance/vertex.glsl';

import fragment2 from './left-slide-in/fragment.glsl';
import vertex2 from './left-slide-in/vertex.glsl';

const effect = (name, fragment, vertex) => ({
  name,
  fragment,
  vertex,
});

export const effects = [
  effect('color distance', fragment, vertex),
  effect('left slide in', fragment2, vertex2),
];
