import { ErrorMapper } from 'utils/error-mapper';
import { tick } from './tick';

export const loop = ErrorMapper.wrapLoop(() => {
  tick({ memory: Memory, game: Game });
});
