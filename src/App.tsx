import React from 'react';
import { connect } from 'react-redux';

import { RootStore, init, TypeOfConnect, thunkAction, unboxThunk } from 'src/redux';

const storeEnhancer = connect(
  (state: RootStore) => ({
    ...state,
  }), {
    init,
    thunkAction: unboxThunk(thunkAction),
  },
  null,
  { pure: false },
);

type AppProps = {}
  & TypeOfConnect<typeof storeEnhancer>
;

class App extends React.PureComponent<AppProps> {
  componentDidMount() {
    this.props.init();
    this.props.thunkAction(3000);
  }
  render() {
    return (
      <>
        <div>{this.props.a}</div>
        <div>{this.props.b}</div>
        <div>{String(this.props.c)}</div>
      </>
    );
  }
}

export default storeEnhancer(App);
