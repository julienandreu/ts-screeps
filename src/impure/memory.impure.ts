export const setImpureMemoryVersion = (version: string): Memory => {
  Memory.version = version;
  return Memory;
};

export const trackImpureCPUUsed = <C extends (...args: any) => any>(context: string, callback: C): ReturnType<C> => {
  const startCpuUsed = Game.cpu.getUsed();
  const output = callback();
  const finalCpuUsed = Game.cpu.getUsed();
  const elapsedCpuUsed = Math.round((finalCpuUsed - startCpuUsed) * Math.pow(10, 2)) / Math.pow(10, 2);
  console.log(`Function "${context}" has used ${elapsedCpuUsed} CPU time`);
  return output;
};

export const mementoMori = (): string[] =>
  Object.keys(Memory.creeps)
    .filter((name) => !Game.creeps[name])
    .map((name) => {
      console.log(`Clean memory for Creep "${name}"`);
      delete Memory.creeps[name];
      return name;
    });
