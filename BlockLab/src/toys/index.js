import { AvalancheToy } from './AvalancheToy.jsx';
import { CaesarToy } from './CaesarToy.jsx';
import { CrackToy } from './CrackToy.jsx';
import { HashToy } from './HashToy.jsx';
import { KeySizeToy } from './KeySizeToy.jsx';
import { OneWayToy } from './OneWayToy.jsx';

/* Lesson `toy` names (src/data/course.js) mapped to their components. */
export const TOYS = {
  caesar: CaesarToy,
  crack: CrackToy,
  keysize: KeySizeToy,
  hash: HashToy,
  avalanche: AvalancheToy,
  oneway: OneWayToy
};
