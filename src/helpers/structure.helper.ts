export const findNearestStructure = <T extends AnyStructure>(
  creep: Creep,
  structureType: StructureConstant,
): T | null =>
  creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: ({ structureType: type }) => type === structureType,
  });

export const findNearestConstructionSite = (creep: Creep): ConstructionSite | null =>
  creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);

export const findNearestSource = (creep: Creep): Source | null => creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
