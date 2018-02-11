import React from 'react';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import { View, Image, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native';

import BaseExamplePropTypes from './common/BaseExamplePropTypes';
import Page from './common/Page';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  snapshot: {
    flex: 1,
  },
});

class TakeSnapshot extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  constructor (props) {
    super(props);

    this.state = {
      snapshotURI: null,
    };
  }

  async componentDidMount () {
    const { width, height } = Dimensions.get('window');

    const uri = await MapboxGL.snapshotManager.takeSnap({
      centerCoordinate: [-74.126410, 40.797968],
      width: width,
      height: height,
      zoomLevel: 12,
      pitch: 30,
      heading: 20,
      styleURL: MapboxGL.StyleURL.Dark,
      writeToDisk: true, // creates a temp file
    });

    this.setState({ snapshotURI: uri });
  }

  render () {
    let childView = null;

    if (!this.state.snapshotURI) {
      childView = (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Generating Snapshot</Text>
        </View>
      );
    } else {
      childView = (
        <View style={styles.container}>
          <Image
            source={{ uri: this.state.snapshotURI }}
            resizeMode='contain'
            style={styles.snapshot} />
        </View>
      );
    }

    return (
      <Page {...this.props}>
        {childView}
      </Page>
    );
  }
}

export default TakeSnapshot;
