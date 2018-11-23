// todo:
// 1. test all operations in helper with any types
// 2. revise helper to use Post object for everything
// 3. move onto another form of storage (comments?)
// 4. devise MVP criteria (posts + comments + accounts?)

import { Client, StoreMode, Collection } from 'documentdb-typescript';

class DBHelper {
    private url: string;
    private key: string;
    private client: Client;

    private readonly dbId = 'reunion-site';
    private readonly dbName = 'site';

    constructor(url: string, key: string) {
        this.url = url;
        this.key = key;

        this.client = new Client(this.url, this.key);
        this.client.enableConsoleLog = true;
    }

    public async addItem(document: any): Promise<any> {
        try {
            const coll = new Collection(this.dbId, this.dbName, this.client);
            await coll.openOrCreateDatabaseAsync();
            document = await coll.storeDocumentAsync(document, StoreMode.CreateOnly);
            return document;
        } catch (ex) {
            console.log(ex);
            return null;
        }
    }

    public async updateItem(document: any): Promise<any> {
        try {
            const coll = new Collection(this.dbId, this.dbName, this.client);
            await coll.openOrCreateDatabaseAsync();
            document = await coll.storeDocumentAsync(document, StoreMode.UpdateOnly);
            return document;
        } catch (ex) {
            console.log(ex);
            return null;
        }
    }

    public async getItem(id: string): Promise<any> {
        try {
            const coll = new Collection(this.dbId, this.dbName, this.client);
            await coll.openOrCreateDatabaseAsync();
            const document = await coll.findDocumentAsync(id);
            return document;
        } catch (ex) {
            console.log(ex);
            return null;
        }
    }

    public async deleteItem(id: string): Promise<boolean> {
        try {
            const coll = new Collection(this.dbId, this.dbName, this.client);
            await coll.deleteDocumentAsync(id);
            return true;
        } catch (ex) {
            console.log(ex);
            return false;
        }
    }

    // todo: figure out how to get all documents
    // figure out how to find/delete by a certain category
    // how to get auto-incrementing ids (nope. guid is assigned.)

    public async getAllPosts(): Promise<any> {
        try {
            const coll = new Collection(this.dbId, this.dbName, this.client);
            const result = await coll.queryDocuments().toArray();
            return result;
        } catch (ex) {
            console.log(ex);
        }
        return [];
    }

    public async test(): Promise<number> {
        const client = new Client(this.url, this.key);
        client.enableConsoleLog = true;
        const coll = new Collection("test", "sample", client);
        await coll.openOrCreateDatabaseAsync();

        // create a document (fails if ID exists),
        // returns document with meta properties
        let doc = { id: "abc", foo: "bar" };
        doc = await coll.storeDocumentAsync(doc, StoreMode.CreateOnly);

        // update a document (fails if not found)
        doc.foo = "baz";
        doc = await coll.storeDocumentAsync(doc, StoreMode.UpdateOnly);

        // update a document if not changed in DB,
        // using _etag property (which must exist)
        doc.foo = "bla";
        doc = await coll.storeDocumentAsync(doc, StoreMode.UpdateOnlyIfNoChange);

        // upsert a document (in parallel, without errors)
        const doc2 = { id: "abc", foo: "bar" };
        const doc3 = { id: "abc", foo: "baz" };
        await Promise.all([
            coll.storeDocumentAsync(doc, StoreMode.Upsert),
            coll.storeDocumentAsync(doc)  // same
        ]);

        // delete the document (fails if not found)
        await coll.deleteDocumentAsync(doc);

        // ... or delete by ID (fails if not found)
        //await coll.deleteDocumentAsync("abc");
        return 5;
    }
}

export { DBHelper };
