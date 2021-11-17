import { pipe } from 'fp-ts/function';
import { version } from '../config.json';
import { setImpureMemoryVersion } from '../impure/memory.impure';

export const notifyTime = ({ time }: Game): void => pipe(time, console.log);

export const notifyVersionChange = (memory: Memory): Memory => {
  const { version: previousVersion } = memory;
  if (previousVersion !== version) {
    const message = !previousVersion
      ? `New version pushed: v${version}`
      : `New version pushed: v${previousVersion} --> v${version}`;
    return pipe(message, console.log, () => version, setImpureMemoryVersion);
  }

  return memory;
};
