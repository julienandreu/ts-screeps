import { pipe } from 'fp-ts/function';
import { notifyTime, notifyVersionChange } from './routines/notification.routine';
import config from './config.json';
import { spawnCreep } from './routines/spawning.routine';
import { debounceImpure } from './impure/debounce.impure';
import { getLength } from './helpers/array.helper';
import { Not } from './helpers/boolean.helper';
import { dispatch } from './routines/dispatch.routine';
import { mementoMori } from './impure/memory.impure';

const {
  log: { time: shouldLogTimeChange, version: shouldLogVersionChange },
} = config;

export const tick = ({ memory, game }: { memory: Memory; game: Game }): void => {
  if (shouldLogVersionChange) pipe(memory, notifyVersionChange);
  if (shouldLogTimeChange) pipe(game, notifyTime);

  debounceImpure(() => pipe(game, spawnCreep), 50, pipe(game.creeps, Object.values, getLength, Not));

  Object.values(Game.creeps).map(dispatch);

  mementoMori();

  Game.cpu.generatePixel();
};
