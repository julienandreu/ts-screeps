export const debounceImpure = (callback: () => unknown, wait: number, exception: boolean = false) =>
  Game.time % wait === 0 || exception ? callback() : null;
