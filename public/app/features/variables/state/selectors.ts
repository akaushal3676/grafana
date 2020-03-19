import { cloneDeep } from 'lodash';

import { StoreState } from '../../../types';
import { VariableModel } from '../../templating/variable';
import { getState } from '../../../store/store';
import { EMPTY_UUID } from './types';

export const getVariable = <T extends VariableModel = VariableModel>(
  uuid: string,
  state: StoreState = getState()
): T => {
  if (!state.templating.variables[uuid]) {
    throw new Error(`Couldn't find variable with uuid:${uuid}`);
  }

  return state.templating.variables[uuid] as T;
};

export const getFilteredVariables = (filter: (model: VariableModel) => boolean, state: StoreState = getState()) => {
  return Object.values(state.templating.variables).filter(filter);
};

export const getVariableWithName = (name: string, state: StoreState = getState()) => {
  return Object.values(state.templating.variables).find(variable => variable.name === name);
};

export const getVariables = (state: StoreState = getState()): VariableModel[] => {
  return getFilteredVariables(variable => variable.uuid! !== EMPTY_UUID, state);
};

export const getVariableClones = (state: StoreState = getState(), includeEmptyUuid = false): VariableModel[] => {
  const variables = getFilteredVariables(
    variable => (includeEmptyUuid ? true : variable.uuid !== EMPTY_UUID),
    state
  ).map(variable => cloneDeep(variable));
  return variables.sort((s1, s2) => s1.index! - s2.index!);
};
