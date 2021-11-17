import { harvester } from '../roles/harvester.role';
import { BrainedCreep } from '../roles/brained-creep.interface';
import { upgrader } from '../roles/upgrader.role';
import { builder } from '../roles/builder.role';

export const dispatch = (creep: Creep): BrainedCreep => {
  switch (creep.memory.role) {
    case 'builder':
      return builder(creep);
    case 'upgrader':
    case 'harvester':
      return upgrader(creep);
    default:
      return harvester(creep);
  }
};
