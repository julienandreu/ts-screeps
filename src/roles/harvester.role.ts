import { findNearestSource, findNearestStructure } from '../helpers/structure.helper';
import { noAction } from '../actions/no.action';
import { harvestAction } from '../actions/harvest.action';
import { storeAction } from '../actions/store.action';
import { BrainedCreep } from './brained-creep.interface';
import { pipe } from 'fp-ts/function';
import { Role } from './roles-registry';
import { hasFreeCapacity, initializeBrain, isHandlingEnergy } from './brained-creep';

export const harvesterRole: Role = {
  body: [WORK, MOVE, CARRY],
  name: 'harvester',
  icon: '⛏️',
};

const observe = (brainedCreep: BrainedCreep): BrainedCreep => {
  const { creep } = brainedCreep;
  return {
    ...brainedCreep,
    observation: {
      ...brainedCreep.observation,
      isHandlingEnergy: isHandlingEnergy(brainedCreep),
      hasFreeCapacity: hasFreeCapacity(brainedCreep),
      nearestActiveSource: findNearestSource(creep),
      nearestSpawn: findNearestStructure<StructureSpawn>(creep, STRUCTURE_SPAWN),
    },
  };
};

const orient = (brainedCreep: BrainedCreep): BrainedCreep => {
  const {
    observation: { isHandlingEnergy, hasFreeCapacity, nearestActiveSource, nearestSpawn },
  } = brainedCreep;
  return {
    ...brainedCreep,
    orientation: {
      ...brainedCreep.orientation,
      couldHarvest: Boolean(hasFreeCapacity) && Boolean(nearestActiveSource),
      couldStore: isHandlingEnergy && Boolean(nearestSpawn),
      spawn: nearestSpawn,
      source: nearestActiveSource,
    },
  };
};

const decide = (brainedCreep: BrainedCreep): BrainedCreep => {
  const {
    orientation: { couldHarvest, couldStore, spawn, source },
  } = brainedCreep;
  return {
    ...brainedCreep,
    decision: (() => {
      switch (true) {
        case couldHarvest:
          return harvestAction(source);
        case couldStore:
          return storeAction(spawn);
        default:
          return noAction();
      }
    })(),
  };
};

const act = (brainedCreep: BrainedCreep): BrainedCreep => {
  const { creep, decision } = brainedCreep;
  return {
    ...brainedCreep,
    action: decision(creep),
  };
};

export const harvester = (creep: Creep): BrainedCreep => pipe(creep, initializeBrain, observe, orient, decide, act);
