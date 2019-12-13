import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { StorageService } from 'src/app/storage.service';
import { Node } from './nodes.model';

@Injectable({
  providedIn: 'root'
})
export class NodesService {

  private _nodes: Node[] = [];
  currentHeight: number;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  fetchCurrentHeight(): Promise<any> {
    return this.http.get<any>('https://node1.elaphant.app/api/1/currHeight')
      .toPromise()
      .then(responce => {
        this.currentHeight = responce.result;
        console.log('Current height -> ' + this.currentHeight);
      })
      .catch(err => console.log(err));
  }

  fetchNodes(): Observable<any> {
    console.log('Fetching Nodes..');
    return this.http.get<any>('https://node1.elaphant.app/api/v1/dpos/rank/height/' + this.currentHeight).pipe(
      tap(response => {
        this._nodes = this._nodes.concat(response.result);
        return this._nodes;
      })
    );
  }

  getNodeIcon() {
    this._nodes.map(node => {
      if (node.Url && node.State === 'Active') {
        this.http.get<any>(node.Url + '/bpinfo.json').subscribe(responce => {
          node.imageUrl = responce.org.branding.logo_256;
          node.Location = responce.org.location.country;
        },
        error => {
          console.log('Node does not have extra data', error);
        });
      }
    });
  }

  get nodes(): Node[] {
    return [...this._nodes.filter((a,b) => this._nodes.indexOf(a) === b)];
  }

  getNode(id: string): any {
    return {...this._nodes.find(node => node.Producer_public_key === id)};
  }

   // Storage
   getStoredNodes() {
    this.storageService.getNodes().then(data => {
      console.log(data);
      this._nodes.map(node => {
        if (data.includes(node.Ownerpublickey)) {
          node.isChecked = true;
        }
      })
    });
  }
}
