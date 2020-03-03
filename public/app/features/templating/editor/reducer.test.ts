import { reducerTester } from '../../../../test/core/redux/reducerTester';
import {
  addVariableEditorError,
  changeVariableEditorExtended,
  changeVariableNameFailed,
  changeVariableNameSucceeded,
  initialVariableEditorState,
  removeVariableEditorError,
  variableEditorMounted,
  variableEditorReducer,
  VariableEditorState,
  variableEditorUnMounted,
} from './reducer';
import { toVariablePayload } from '../state/actions';

describe('variableEditorReducer', () => {
  describe('when variableEditorMounted is dispatched', () => {
    it('then state should be correct ', () => {
      const payload = 'A name';
      reducerTester<VariableEditorState>()
        .givenReducer(variableEditorReducer, { ...initialVariableEditorState })
        .whenActionIsDispatched(variableEditorMounted(payload))
        .thenStateShouldEqual({
          ...initialVariableEditorState,
          name: 'A name',
        });
    });
  });

  describe('when variableEditorUnMounted is dispatched', () => {
    it('then state should be correct ', () => {
      const initialState = {
        ...initialVariableEditorState,
        name: 'A name',
        isValid: false,
        errors: { update: 'Something wrong' },
        extended: { prop: 1000 },
      };
      const payload = toVariablePayload({ name: 'A name', type: 'textbox' });
      reducerTester<VariableEditorState>()
        .givenReducer(variableEditorReducer, initialState)
        .whenActionIsDispatched(variableEditorUnMounted(payload))
        .thenStateShouldEqual({ ...initialVariableEditorState });
    });
  });

  describe('when changeVariableNameSucceeded is dispatched there are other errors', () => {
    it('then state should be correct ', () => {
      const initialState = {
        ...initialVariableEditorState,
        name: 'A duplicate name',
        isValid: false,
        errors: { name: 'Duplicate', update: 'Update failed' },
      };
      const payload = toVariablePayload({ name: 'A duplicate name', type: 'textbox' }, 'New Name');
      reducerTester<VariableEditorState>()
        .givenReducer(variableEditorReducer, initialState)
        .whenActionIsDispatched(changeVariableNameSucceeded(payload))
        .thenStateShouldEqual({
          ...initialState,
          isValid: false,
          errors: { update: 'Update failed' },
          name: 'New Name',
        });
    });
  });

  describe('when changeVariableNameSucceeded is dispatched there are no other errors', () => {
    it('then state should be correct ', () => {
      const initialState = {
        ...initialVariableEditorState,
        name: 'A duplicate name',
        isValid: false,
        errors: { name: 'Duplicate' },
      };
      const payload = toVariablePayload({ name: 'A duplicate name', type: 'textbox' }, 'New Name');
      reducerTester<VariableEditorState>()
        .givenReducer(variableEditorReducer, initialState)
        .whenActionIsDispatched(changeVariableNameSucceeded(payload))
        .thenStateShouldEqual({
          ...initialState,
          isValid: true,
          errors: {},
          name: 'New Name',
        });
    });
  });

  describe('when changeVariableNameFailed is dispatched', () => {
    it('then state should be correct ', () => {
      const payload = { newName: 'Duplicate name', errorText: 'Name is an duplicate' };
      reducerTester<VariableEditorState>()
        .givenReducer(variableEditorReducer, { ...initialVariableEditorState })
        .whenActionIsDispatched(changeVariableNameFailed(payload))
        .thenStateShouldEqual({
          ...initialVariableEditorState,
          isValid: false,
          errors: { name: 'Name is an duplicate' },
          name: 'Duplicate name',
        });
    });
  });

  describe('when addVariableEditorError is dispatched', () => {
    it('then state should be correct ', () => {
      const payload = { errorProp: 'someProp', errorText: 'someProp failed' };
      reducerTester<VariableEditorState>()
        .givenReducer(variableEditorReducer, { ...initialVariableEditorState })
        .whenActionIsDispatched(addVariableEditorError(payload))
        .thenStateShouldEqual({
          ...initialVariableEditorState,
          isValid: false,
          errors: { someProp: 'someProp failed' },
        });
    });
  });

  describe('when removeVariableEditorError is dispatched and there are other errors', () => {
    it('then state should be correct ', () => {
      const payload = { errorProp: 'someProp' };
      reducerTester<VariableEditorState>()
        .givenReducer(variableEditorReducer, {
          ...initialVariableEditorState,
          errors: { update: 'Update failed', someProp: 'someProp failed' },
          isValid: false,
        })
        .whenActionIsDispatched(removeVariableEditorError(payload))
        .thenStateShouldEqual({
          ...initialVariableEditorState,
          isValid: false,
          errors: { update: 'Update failed' },
        });
    });
  });

  describe('when removeVariableEditorError is dispatched and there are no other errors', () => {
    it('then state should be correct ', () => {
      const payload = { errorProp: 'someProp' };
      reducerTester<VariableEditorState>()
        .givenReducer(variableEditorReducer, {
          ...initialVariableEditorState,
          errors: { someProp: 'someProp failed' },
          isValid: false,
        })
        .whenActionIsDispatched(removeVariableEditorError(payload))
        .thenStateShouldEqual({
          ...initialVariableEditorState,
          isValid: true,
          errors: {},
        });
    });
  });

  describe('when changeVariableEditorExtended is dispatched', () => {
    it('then state should be correct ', () => {
      const payload = { propName: 'someProp', propValue: [{}] };
      reducerTester<VariableEditorState>()
        .givenReducer(variableEditorReducer, { ...initialVariableEditorState })
        .whenActionIsDispatched(changeVariableEditorExtended(payload))
        .thenStateShouldEqual({
          ...initialVariableEditorState,
          extended: {
            someProp: [{}],
          },
        });
    });
  });
});