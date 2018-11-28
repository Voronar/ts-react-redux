import { createStore, Action, applyMiddleware, AnyAction } from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { InferableComponentEnhancerWithProps } from 'react-redux';

export type TypeOfConnect<T> = T extends InferableComponentEnhancerWithProps<infer Props, infer _>
  ? Props
  : never
;

export type CutMiddleFunction<T> = T extends (...arg: infer Args) => (...args: any[]) => infer R
  ? (...arg: Args) => R
  : never
;

export const unboxThunk = <Args extends any[], R, S, E, A extends Action<any>>(
  thunkFn: (...args: Args) => ThunkAction<R, S, E, A>,
) => (
  thunkFn as any as CutMiddleFunction<typeof thunkFn>
);

export type RootStore = {
  a: number,
  b: string,
  c: boolean,
};

const initialState: RootStore = {
  a: 0,
  b: 'initial',
  c: false,
};

type InitAction = Action<'init'>;
type ResetAction = Action<'reset'>;

type Actions =
  | InitAction
  | ResetAction
;

export const init = (): InitAction => ({
  type: 'init',
});

export const reset = (): ResetAction => ({
  type: 'reset',
});

export const thunkAction = (delay: number): ThunkAction<void, RootStore, void, AnyAction> => (dispatch) => {
  console.log('waiting for', delay);
  setTimeout(() => {
    console.log('reset');
    dispatch(reset());
  }, delay);
};

const reducer = (state = initialState , action: Actions) => {
  switch (action.type) {
    case 'init':
      return {
        ...state,
        a: state.a + 1,
        b: 'updated',
        c: true,
      };
    case 'reset':
      return {
        ...initialState,
      };

    default: return state;
  }
};

export const store = createStore(
  reducer,
  applyMiddleware(thunk, createLogger()),
);
