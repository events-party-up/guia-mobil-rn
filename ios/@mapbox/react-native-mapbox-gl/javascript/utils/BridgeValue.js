import { isBoolean, isNumber, isString } from './index';

const Types = {
  Array: 'array',
  Bool: 'boolean',
  Number: 'number',
  String: 'string',
  HashMap: 'hashmap',
};

export default class BridgeValue {
  constructor (rawValue) {
    this.rawValue = rawValue;
  }

  get type () {
    if (Array.isArray(this.rawValue)) {
      return Types.Array;
    } else if (isBoolean(this.rawValue)) {
      return Types.Bool;
    } else if (isNumber(this.rawValue)) {
      return Types.Number;
    } else if (isString(this.rawValue)) {
      return Types.String;
    } else if (this.rawValue && typeof this.rawValue === 'object') {
      return Types.HashMap;
    } else {
      throw new Error('[type] BridgeValue must be a primitive/array/object');
    }
  }

  get value () {
    const type = this.type;

    let value;

    if (type === Types.Array) {
      value = [];

      for (let innerRawValue of this.rawValue) {
        const bridgeValue = new BridgeValue(innerRawValue);
        value.push(bridgeValue.toJSON());
      }
    } else if (type === Types.HashMap) {
      value = [];

      const stringKeys = Object.keys(this.rawValue);
      for (let stringKey of stringKeys) {
        value.push([
          (new BridgeValue(stringKey)).toJSON(),
          (new BridgeValue(this.rawValue[stringKey])).toJSON(),
        ]);
      }
    } else if (type === Types.Bool || type === Types.Number || type === Types.String) {
      value = this.rawValue;
    } else {
      throw new Error('[value] BridgeValue must be a primitive/array/object');
    }

    return value;
  }

  toJSON () {
    return {
      type: this.type,
      value: this.value,
    };
  }
}
