class IndexDB {
  OpenDB(dbName = "ServiceWorkerDB", dbVersion = 1, stores) {
    return new Promise((resolve, reject) => {
      let indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB;
      if (!indexedDB) {
        reject(
          "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
        );
        return;
      }
      let request = indexedDB.open(dbName, dbVersion);
      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };
      request.onerror = (event) => reject(event.target.error);
      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        stores.forEach((store) => {
          this.db.createObjectStore(store.name, store.option);
        });
        resolve(this.db);
      };
    });
  }
  Upsert(storeName, data) {
    return new Promise((resolve, reject) => {
      if (this.db && data) {
        let transaction = this.db.transaction([storeName], "readwrite");
        transaction.onabort = (te) => reject(te.target.error);
        transaction.onerror = (te) => reject(te.target.error);

        let request = transaction.objectStore(storeName).put(data, data._id);

        request.onerror = (e) => reject(e.target.error);
        request.onsuccess = (e) => resolve(e.target.result);
      } else reject("no DB entered/data");
    });
  }
  GetAll(storeName) {
    return new Promise((resolve, reject) => {
      if (this.db) {
        let request = this.db
          .transaction([storeName], "readwrite")
          .objectStore(storeName)
          .getAll();
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
        request.onerror = (e) => reject(e.target.error);
      } else reject("no DB entered");
    });
  }
  Remove(storeName, key) {
    return new Promise((resolve, reject) => {
      if (this.db) {
        let transaction = this.db.transaction([storeName], "readwrite");
        transaction.onabort = (te) => reject(te.target.error);
        transaction.onerror = (te) => reject(te.target.error);
          let request = transaction.objectStore(storeName).delete(key);

        request.onerror = (e) => reject(e.target.error);
        request.onsuccess = (e) => resolve(e.target.result);
      } else reject("no DB entered");
    });
  }
}
export default IndexDB;
