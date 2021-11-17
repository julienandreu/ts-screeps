import { noAction } from './no.action';

export const upgradeAction = (maybeController: Structure | null) => {
  if (!maybeController) {
    console.log(`Missing spawn`);
    return noAction();
  }
  const controller = maybeController as StructureController;
  return (creep: Creep) => {
    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(controller, { reusePath: 1, visualizePathStyle: { stroke: '#D47D6A' } });
    }
  };
};
