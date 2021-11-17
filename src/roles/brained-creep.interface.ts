import { DecidedAction } from '../actions/action.interface';

export interface BrainedCreep {
  creep: Creep;
  observation: {
    isHandlingEnergy: boolean;
    hasFreeCapacity: boolean;
    nearestActiveSource: Source | null;
    nearestSpawn: StructureSpawn | null;
    nearestController: StructureController | null;
    nearestBuildableStructure: ConstructionSite | null;
  };
  orientation: {
    couldHarvest: boolean;
    couldStore: boolean;
    couldUpgrade: boolean;
    couldBuild: boolean;
    spawn: StructureSpawn | null;
    source: Source | null;
    controller: StructureController | null;
    buildableStructure: ConstructionSite | null;
  };
  decision: DecidedAction;
  action: unknown;
}
