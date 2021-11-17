import { noAction } from './no.action';

export const storeAction = (maybeSpawn: Structure | null) => {
  if (!maybeSpawn) {
    console.log(`Missing spawn`);
    return noAction();
  }
  const spawn = maybeSpawn as StructureSpawn;
  return (creep: Creep) => {
    if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(spawn, { reusePath: 1, visualizePathStyle: { stroke: '#FF851B' } });
    }
  };
};
