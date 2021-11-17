import { noAction } from './no.action';

export const buildAction = (maybeBuildableStructure: ConstructionSite | null) => {
  if (!maybeBuildableStructure) {
    console.log(`Missing buildable structure`);
    return noAction();
  }
  const buildableStructure = maybeBuildableStructure as ConstructionSite;
  return (creep: Creep) => {
    if (creep.build(buildableStructure) === ERR_NOT_IN_RANGE) {
      creep.moveTo(buildableStructure, { reusePath: 1, visualizePathStyle: { stroke: '#D4D4D4' } });
    }
  };
};
