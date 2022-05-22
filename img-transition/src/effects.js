import fragment from './effects/color-distance/fragment.glsl';
import vertex from './effects/color-distance/vertex.glsl';

import fragment2 from './effects/left-slide-in/fragment.glsl';
import vertex2 from './effects/left-slide-in/vertex.glsl';

const effect = (name, fragment, vertex) => ({
  name,
  fragment,
  vertex,
});

export const effects = [
  effect('color distance', fragment, vertex),
  effect('left slide in', fragment2, vertex2),
];
