import { harvestAction } from './harvest.action';
import { storeAction } from './store.action';
import { noAction } from './no.action';

export type DecidedAction = ReturnType<typeof harvestAction | typeof storeAction | typeof noAction>;
