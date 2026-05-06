export async function register() {
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.getItem("__test__");
    } catch {
      // Node.js has a broken localStorage (--localstorage-file without valid path).
      // Replace it with a no-op in-memory implementation so SSR libraries don't crash.
      const store = new Map<string, string>();
      const storage = {
        getItem(key: string) {
          return store.get(key) ?? null;
        },
        setItem(key: string, value: string) {
          store.set(key, String(value));
        },
        removeItem(key: string) {
          store.delete(key);
        },
        clear() {
          store.clear();
        },
        get length() {
          return store.size;
        },
        key(index: number) {
          return [...store.keys()][index] ?? null;
        },
      };
      (globalThis as any).localStorage = storage;
    }
  }
}
