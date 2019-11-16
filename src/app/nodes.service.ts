import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Node } from './nodes.model';

@Injectable({
  providedIn: 'root'
})
export class NodesService {

  private _nodes: Node[] = [];

  currentHeight: any;

  constructor(private http: HttpClient) {}

  fetchCurrentHeight() {
    this.http.get<any>('https://node1.elaphant.app/api/1/currHeight').subscribe(responce => {
      this.currentHeight = responce.result;
      console.log('Current height -> ' + this.currentHeight);
    });
  }

  fetchNodes(): Observable<any> {
    console.log('Fetching Nodes..');
    return this.http.get<any>('https://node1.elaphant.app/api/v1/dpos/rank/height/' + this.currentHeight).pipe(
      tap(response => {
        this._nodes = this._nodes.concat(response.result);
        console.log('Nodes from service ->', this._nodes);
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
          console.log('Node does not have logo', error);
        });
      }
    });
  }

  get nodes() {
    return [...this._nodes];
  }

  getNode(id: string) {
    return {...this._nodes.find(node => node.Producer_public_key === id)};
  }
}
