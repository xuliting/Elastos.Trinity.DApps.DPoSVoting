import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
  }

  public setNodes(value: any) {
    return this.storage.set("nodes", JSON.stringify(value)).then((data) => {
      console.log('Stored nodes', data)
    });
  }

  public getNodes(): Promise<any> {
    return this.storage.get("nodes").then((data) => {
      console.log(data)
      return JSON.parse(data);
    });
  }
}
