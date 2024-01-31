class MemoryStorage {
  private store: Map<string, any>;

  constructor() {
    this.store = new Map<string, any>();
  }

  public getItem(key: string): any {
    return this.store.get(key);
  }
  public setItem(key: string, value: string): any {
    return this.store.set(key, value);
  }

  public removeItem(key: string): void {}
}

function testLocalStorage(): boolean {
  const testKey = 'x-test-key';
  try {
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

const Storage = testLocalStorage() ? localStorage : new MemoryStorage();
export default Storage;
