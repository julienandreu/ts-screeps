import { pipe } from 'fp-ts/function';
import { findFirst } from 'fp-ts/Array';
import { fold as OFold } from 'fp-ts/Option';
import { names, uniqueNamesGenerator } from 'unique-names-generator';
import { Either, fold as EFold, left, right } from 'fp-ts/Either';
import { Role, RoleName, rolesRegistry } from '../roles/roles-registry';

interface CreepAttributes {
  spawn: StructureSpawn;
  name?: string;
  body?: BodyPartConstant[];
  cost?: number;
  role: Role;
}

const createCreepAttributesFromSpawn = (spawn: StructureSpawn): CreepAttributes => ({
  spawn,
  role: rolesRegistry.harvester,
});

const generateRandomName = (creepAttributes: CreepAttributes): CreepAttributes => ({
  ...creepAttributes,
  name: uniqueNamesGenerator({ dictionaries: [names] }),
});

const defineRole =
  (name: RoleName = 'harvester') =>
  (creepAttributes: CreepAttributes): CreepAttributes => ({
    ...creepAttributes,
    name: `${rolesRegistry[name].icon ?? rolesRegistry.harvester.icon} ${creepAttributes.name}`,
    role: rolesRegistry[name] ?? rolesRegistry.harvester,
  });

const defineBody = (creepAttributes: CreepAttributes): CreepAttributes => ({
  ...creepAttributes,
  body: creepAttributes?.role?.body ?? rolesRegistry.harvester.body,
});

const calculateCost = (creepAttributes: CreepAttributes): CreepAttributes => ({
  ...creepAttributes,
  cost: (creepAttributes.body || []).reduce((totalCost, bodyPart) => totalCost + BODYPART_COST[bodyPart], 0),
});

const validateCostFromStoreAmount = (creepAttributes: CreepAttributes): Either<string, CreepAttributes> => {
  const {
    spawn: { store, energy },
    cost = 0,
  } = creepAttributes;
  return store[RESOURCE_ENERGY] <= cost
    ? left(`Missing ${energy - cost} energy to create new creep`)
    : right(creepAttributes);
};

const getOperationMessage = (operationCode: number): string => {
  switch (operationCode) {
    case -1:
      return 'You are not the owner of this spawn.';
    case -3:
      return 'There is a creeps with the same name already.';
    case -4:
      return 'The spawn is already in process of spawning another creeps.';
    case -6:
      return 'The spawn and its extensions contain not enough energy to create a creeps with the given body.';
    case -10:
      return 'Body is not properly described or name was not provided.';
    case -14:
      return 'Your Room Controller level is insufficient to use this spawn.';
    case 0:
    default:
      return 'The operation has been scheduled successfully.';
  }
};

const getActionDetailMessage =
  (name: string) =>
  (operationMessage: string): string =>
    `Spawning Creep "${name}": ${operationMessage}`;

export const spawnCreep = ({ spawns }: Game): void =>
  pipe(
    spawns,
    Object.values,
    findFirst(Boolean),
    OFold(
      () => pipe(`Unable to find a Spawn`, console.log),
      (spawn) =>
        pipe(
          spawn,
          createCreepAttributesFromSpawn,
          generateRandomName,
          defineRole(Math.random() > 0.5 ? 'harvester' : 'upgrader'),
          defineBody,
          calculateCost,
          validateCostFromStoreAmount,
          EFold(
            (error) => pipe(error, console.log),
            ({ body, name = 'undefined', role: { name: role = 'harvester' } }) =>
              pipe(
                spawn.spawnCreep(body, name, { memory: { role } }),
                getOperationMessage,
                getActionDetailMessage(name),
                console.log,
              ),
          ),
        ),
    ),
  );
