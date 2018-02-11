import React from 'react';
import MapboxGL from '@mapbox/react-native-mapbox-gl';

import BaseExamplePropTypes from './common/BaseExamplePropTypes';
import Page from './common/Page';

import sheet from '../styles/sheet';
import smileyFaceGeoJSON from '../assets/smiley_face.json';

const layerStyles = MapboxGL.StyleSheet.create({
  smileyFaceLight: {
    fillAntialias: true,
    fillColor: 'white',
    fillOutlineColor: 'rgba(255, 255, 255, 0.84)',
  },
  smileyFaceDark: {
    fillAntialias: true,
    fillColor: 'black',
    fillOutlineColor: 'rgba(0, 0, 0, 0.84)',
  },
});

class TwoByTwo extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  renderMap (styleURL, layerStyle) {
    return (
      <MapboxGL.MapView
          zoomLevel={2}
          centerCoordinate={[-35.15165038, 40.62357280]}
          onSetCameraComplete={this.onUpdateZoomLevel}
          ref={(ref) => this.map = ref}
          style={sheet.matchParent}
          styleURL={styleURL}>
          <MapboxGL.ShapeSource id='smileyFaceSource' shape={smileyFaceGeoJSON}>
            <MapboxGL.FillLayer id='smileyFaceFill' style={layerStyle} />
          </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
    );
  }

  render () {
    return (
      <Page {...this.props}>
        {this.renderMap(MapboxGL.StyleURL.Light, layerStyles.smileyFaceDark)}
        {this.renderMap(MapboxGL.StyleURL.Dark, layerStyles.smileyFaceLight)}
      </Page>
    );
  }
}

export default TwoByTwo;
