import { BrainedCreep } from './brained-creep.interface';
import { noAction } from '../actions/no.action';

export const initializeBrain = (creep: Creep): BrainedCreep => {
  return {
    creep,
    observation: {
      isHandlingEnergy: false,
      hasFreeCapacity: true,
      nearestActiveSource: null,
      nearestSpawn: null,
      nearestController: null,
      nearestBuildableStructure: null,
    },
    orientation: {
      couldHarvest: true,
      couldStore: false,
      couldUpgrade: false,
      couldBuild: false,
      spawn: null,
      source: null,
      controller: null,
      buildableStructure: null,
    },
    decision: noAction(),
    action: {},
  };
};

export const isHandlingEnergy = ({ creep: { store } }: BrainedCreep) => store[RESOURCE_ENERGY] > 0;

export const hasFreeCapacity = ({ creep: { store } }: BrainedCreep) => store.getFreeCapacity() > 0;
