import React from 'react';

import {
  ViewPropTypes,
  View,
  NativeModules,
  findNodeHandle,
  Platform,
} from 'react-native';

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

export const viewPropTypes = ViewPropTypes || View.props;

export function isAndroid () {
  return Platform.OS === 'android';
}

export function isFunction (fn) {
  return typeof fn === 'function';
}

export function isNumber (num) {
  return typeof num === 'number' && !Number.isNaN(num);
}

export function isUndefined (obj) {
  return typeof obj === 'undefined';
}

export function isString (str) {
  return typeof str === 'string';
}

export function isBoolean (bool) {
  return typeof bool === 'boolean';
}

export function isPrimitive (value) {
  return isString(value) || isNumber(value) || isBoolean(value);
}

export function runNativeCommand (module, name, nativeRef, args = []) {
  const handle = findNodeHandle(nativeRef);
  if (!handle) {
    throw new Error(`Could not find handle for native ref ${module}.${name}`);
  }

  const managerInstance = isAndroid() ? NativeModules.UIManager[module] : NativeModules[getIOSModuleName(module)];
  if (!managerInstance) {
    throw new Error(`Could not find ${module}`);
  }

  if (isAndroid()) {
    return NativeModules.UIManager.dispatchViewManagerCommand(
      handle,
      managerInstance.Commands[name],
      args,
    );
  }

  return managerInstance[name](handle, ...args);
}

export function cloneReactChildrenWithProps (children, propsToAdd = {}) {
  if (!children) {
    return null;
  }

  if (!Array.isArray(children)) {
    children = [children];
  }

  const filteredChildren = children.filter((child) => !!child); // filter out falsy children, since some can be null
  return React.Children.map(filteredChildren, (child) => React.cloneElement(child, propsToAdd));
}

export function resolveImagePath (imageRef) {
  const res = resolveAssetSource(imageRef);
  return res.uri;
}

export function getIOSModuleName (moduleName) {
  if (moduleName.startsWith('RCT')) {
    return moduleName.substring(3);
  }
  return moduleName;
}

export function toJSONString (json = '') {
  return JSON.stringify(json);
}
