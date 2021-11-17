import { findNearestConstructionSite, findNearestSource } from '../helpers/structure.helper';
import { noAction } from '../actions/no.action';
import { harvestAction } from '../actions/harvest.action';
import { BrainedCreep } from './brained-creep.interface';
import { pipe } from 'fp-ts/function';
import { Role } from './roles-registry';
import { buildAction } from '../actions/build.action';
import { hasFreeCapacity, initializeBrain, isHandlingEnergy } from './brained-creep';

export const builderRole: Role = {
  body: [WORK, MOVE, CARRY],
  name: 'builder',
  icon: '🧱',
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
      nearestBuildableStructure: findNearestConstructionSite(creep),
    },
  };
};

const orient = (brainedCreep: BrainedCreep): BrainedCreep => {
  const {
    observation: { isHandlingEnergy, hasFreeCapacity, nearestActiveSource, nearestBuildableStructure },
  } = brainedCreep;
  return {
    ...brainedCreep,
    orientation: {
      ...brainedCreep.orientation,
      couldHarvest: Boolean(hasFreeCapacity) && Boolean(nearestActiveSource),
      couldBuild: isHandlingEnergy && Boolean(nearestBuildableStructure),
      source: nearestActiveSource,
      buildableStructure: nearestBuildableStructure,
    },
  };
};

const decide = (brainedCreep: BrainedCreep): BrainedCreep => {
  const {
    orientation: { couldHarvest, couldBuild, buildableStructure, source },
  } = brainedCreep;
  return {
    ...brainedCreep,
    decision: (() => {
      switch (true) {
        case couldBuild:
          return buildAction(buildableStructure);
        case couldHarvest:
          return harvestAction(source);
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

export const builder = (creep: Creep): BrainedCreep => pipe(creep, initializeBrain, observe, orient, decide, act);
