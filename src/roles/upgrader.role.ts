import { findNearestSource, findNearestStructure } from '../helpers/structure.helper';
import { noAction } from '../actions/no.action';
import { harvestAction } from '../actions/harvest.action';
import { BrainedCreep } from './brained-creep.interface';
import { pipe } from 'fp-ts/function';
import { Role } from './roles-registry';
import { upgradeAction } from '../actions/upgrade.action';
import { hasFreeCapacity, initializeBrain, isHandlingEnergy } from './brained-creep';

export const upgraderRole: Role = {
  body: [WORK, MOVE, CARRY],
  name: 'upgrader',
  icon: '↗️',
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
      nearestController: findNearestStructure<StructureController>(creep, STRUCTURE_CONTROLLER),
    },
  };
};

const orient = (brainedCreep: BrainedCreep): BrainedCreep => {
  const {
    observation: { isHandlingEnergy, hasFreeCapacity, nearestActiveSource, nearestController },
  } = brainedCreep;
  return {
    ...brainedCreep,
    orientation: {
      ...brainedCreep.orientation,
      couldHarvest: Boolean(hasFreeCapacity) && Boolean(nearestActiveSource),
      couldStore: false,
      couldUpgrade: isHandlingEnergy && Boolean(nearestController),
      spawn: null,
      source: nearestActiveSource,
      controller: nearestController,
    },
  };
};

const decide = (brainedCreep: BrainedCreep): BrainedCreep => {
  const {
    orientation: { couldHarvest, couldUpgrade, controller, source },
  } = brainedCreep;
  return {
    ...brainedCreep,
    decision: (() => {
      switch (true) {
        case couldHarvest:
          return harvestAction(source);
        case couldUpgrade:
          return upgradeAction(controller);
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

export const upgrader = (creep: Creep): BrainedCreep => pipe(creep, initializeBrain, observe, orient, decide, act);
