import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';

import BaseExamplePropTypes from './common/BaseExamplePropTypes';
import Page from './common/Page';

import sheet from '../styles/sheet';
import colors from '../styles/colors';

const styles = StyleSheet.create({
  button: {
    height: 60,
    backgroundColor: colors.primary.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const layerStyles = MapboxGL.StyleSheet.create({
  building: {
    fillExtrusionHeight: MapboxGL.StyleSheet.identity('height'),
    fillExtrusionBase: MapboxGL.StyleSheet.identity('min_height'),
    fillExtrusionColor: 'blue',
  },
});

class TakeSnapshotWithMap extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  constructor (props) {
    super(props);

    this.state = {
      uri: '',
    };
  }

  async onTakeSnapshot () {
    const uri = await this.map.takeSnap(false);
    this.setState({ uri: uri });
  }

  render () {
    return (
      <Page {...this.props}>
        <View style={{ flex: 1 }}>
          <MapboxGL.MapView
              zoomLevel={16}
              pitch={45}
              centerCoordinate={[-122.400021, 37.789085]}
              ref={(ref) => this.map = ref}
              style={{ flex: 0.5 }}>

              <MapboxGL.VectorSource>
                <MapboxGL.FillExtrusionLayer
                  id='building3d'
                  sourceLayerID='building'
                  style={layerStyles.building} />
              </MapboxGL.VectorSource>
          </MapboxGL.MapView>

          <View style={{ flex: 0.5 }}>
            {this.state.uri ? (
              <Image
                resizeMode='contain'
                style={sheet.matchParent}
                source={{ uri: this.state.uri }} />
            ) : null}
          </View>
        </View>

        <TouchableOpacity onPress={() => this.onTakeSnapshot()}>
          <View style={styles.button}>
            <Text style={{ color: 'white' }}>Take snapshot</Text>
          </View>
        </TouchableOpacity>
      </Page>
    );
  }
}

export default TakeSnapshotWithMap;
