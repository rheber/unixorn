/**
 * Dictionary that returns a default value if no value is present for the given key.
 */
class Defaultdict<V> {
  defaultConstructor: () => V;
  dict: Map<string, V>;

  constructor(dc: () => V) {
    this.defaultConstructor = dc;
    this.dict = new Map();
  }

  get(key: string): V {
    const innerValue = this.dict.get(key);
    if (innerValue) {
      return innerValue;
    }
    const newValue = this.defaultConstructor();
    this.dict.set(key, newValue);
    return newValue;
  }

  set(key: string, value: V) {
    this.dict.set(key, value);
  }
}

export { Defaultdict };
