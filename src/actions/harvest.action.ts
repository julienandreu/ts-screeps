import { noAction } from './no.action';

export const harvestAction = (maybeSource: Source | null) => {
  if (!maybeSource) {
    console.log(`Missing source`);
    return noAction();
  }
  const source = maybeSource as Source;
  return (creep: Creep) => {
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      if (creep.memory._move) {
        creep.moveTo(source, { reusePath: 5, noPathFinding: true, visualizePathStyle: { stroke: '#FFDC00' } });
      } else {
        creep.moveTo(source, { reusePath: 5, visualizePathStyle: { stroke: '#FFDC00' } });
      }
    }
  };
};
