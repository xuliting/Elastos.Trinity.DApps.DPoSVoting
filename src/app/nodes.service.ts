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
  elaNodeUrl: string = 'https://elanodes.com/wp-content/uploads/custom/images/';

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
        console.log('Nodes Fetched..', this._nodes);
        return this._nodes;
      })
    );
  }

  /* getNodeIcon() {
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
  } */

  getNodeIcon() {
    this._nodes.map(node => {
      if (node.Nickname === '韩锋/SunnyFengHan') {
        node.imageUrl = this.elaNodeUrl + 'Sunny_Feng_Han_min.png';
        node.Location = 'United States'
      };
      if (node.Nickname === 'Elephant Wallet') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/elephant-wallet.png';
        node.Location = 'Singapore'
      }
      if (node.Nickname === 'Elastos Scandinavia') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Scandinavia.png';
        node.Location = 'Sweden'
      };
      if (node.Nickname === 'AnyPeer') {
        node.imageUrl = 'data:image/png;base64,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';
        node.Location = 'Hong Kong'
      };
      if (node.Nickname === 'Wild Strawberries Atlas') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/WIld%20Strawberries%20-%20Atlas.png';
        node.Location = 'United States'
      };
      if (node.Nickname === 'Enter Elastos - Ganymede') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Enter%20Elastos.png';
        node.Location = 'Australia'
      };
      if (node.Nickname === 'Wild Strawberries Apollo') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/WIld%20Strawberries%20-%20Apollo.png';
        node.Location = 'Ireland'
      };
      if (node.Nickname === 'Enter Elastos -Callisto') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Enter%20Elastos.png';
        node.Location = 'United States'
      };
      if (node.Nickname === 'TYROLEE(小黑狼)') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/TyroLee.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'Hyper') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/hyperim-logo.png';
        node.Location = 'Austria'
      };
      if (node.Nickname === 'WeFilmchain') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/wefilmchain.png';
        node.Location = 'Canada'
      };
      if (node.Nickname === 'Elastos HIVE') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Hive.png';
        node.Location = 'Hong Kong'
      };
      if (node.Nickname === 'Wild Strawberries Calypso') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/WIld%20Strawberries%20-%20Calypso.png';
        node.Location = 'Brazil'
      };
      if (node.Nickname === 'Enter Elastos - Titan ') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Enter%20Elastos.png';
        node.Location = 'United Kingdom'
      };
      if (node.Nickname === 'Noderators - Watermelon') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Noderators.png';
        node.Location = 'India'
      };
      if (node.Nickname === 'Elate.ch') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/ELATE.CH.png';
        node.Location = 'Switzerland'
      };
      if (node.Nickname === 'ThaiEla') {
        node.imageUrl = 'data:image/png;base64,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';
        node.Location = 'Thailand'
      };
      if (node.Nickname === 'Elastos Carrier') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Carrier.png';
        node.Location = 'Hong Kong'
      };
      if (node.Nickname === 'Cyber Republic Press CR新闻团队') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Cyber%20Republic%20Press3_min.png';
        node.Location = 'United States'
      };
      if (node.Nickname === 'Elastos Forest Node (EFN)') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Elaforestnode.png';
        node.Location = 'Netherlands'
      };
      if (node.Nickname === 'ELA News (ELA新闻)') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/ELA%20News2.png';
        node.Location = 'South Africa'
      };
      if (node.Nickname === 'Elastos News') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/ELA%20News2.png';
        node.Location = 'South Africa'
      };
      if (node.Nickname === 'elafans') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/ELA%20Fans.png';
        node.Location = 'Singapore'
      };
      if (node.Nickname === 'elaHorse @ 亦乐马') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/ELAHORSE1.png';
        node.Location = 'Malaysia'
      };
      if (node.Nickname === 'Witzer（无智）') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Witzer1.png';
        node.Location = 'China'
      };
      if (node.Nickname === '无智(Witzer)') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Witzer1.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'ElastosDMA') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Elastos%20DMA_min.png';
        node.Location = 'United States'
      };
      if (node.Nickname === 'ELAONSEN 亦来温泉') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/ELAONSEN.png';
        node.Location = 'Hong Kong'
      };
      if (node.Nickname === 'Starfish') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Starfish.png';
        node.Location = 'United States'
      };
      if (node.Nickname === 'greengang') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Greengang1.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'Elastos Australia') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Elastos%20Australia1.png';
        node.Location = 'Australia'
      };
      if (node.Nickname === 'DACA区块链技术公开课') {
        node.imageUrl = 'data:image/png;base64,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';
        node.Location = 'China'
      };
      if (node.Nickname === 'RUOLAN(若兰)') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Roulon1.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'RUOLAN节点') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Roulon1.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'The Houston Supernode') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Houston-Supernode2_min.png';
        node.Location = 'United States'
      };
      if (node.Nickname === 'Cheery Community') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/CheeryCommunity1_min.png';
        node.Location = 'Australia'
      };
      if (node.Nickname === 'KuCoin') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/KuCoin.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'Noderators - Champagne') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Noderators.png';
        node.Location = 'United States'
      };
      if (node.Nickname === 'Noderators - Jazz') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Noderators.png';
        node.Location = 'United States'
      };
      if (node.Nickname === 'Quantum Wealth Supernode') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Quantum%20Wealth%20Supernode.png';
        node.Location = 'United States'
      };
      if (node.Nickname === 'Northern Lights') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Northern%20Lights.png';
        node.Location = 'Russia'
      };
      if (node.Nickname === '链世界') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Blockchain_World_1.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'HashWorld') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/HashWorld.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'IOEX(ioeX Network)') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/ioeX2.png';
        node.Location = 'Hong Kong'
      };
      if (node.Nickname === 'Antpool-ELA') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Antpool.png';
        node.Location = 'Brazil'
      };
      if (node.Nickname === 'Black Swan') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Black-Swan1.png';
        node.Location = 'Czech Republic'
      };
      if (node.Nickname === 'DHG(大黄哥)') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/DHG2.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'DHG') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/DHG2.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'CR Regions Global Fund - Clarence Liu') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Cyber%20Republic%20Regions.png';
        node.Location = 'United States'
      };
      if (node.Nickname === 'CR Herald | CR 先锋资讯') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/CR%20Herald.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'BitWork (CR Region HK)') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/BitWork.png';
        node.Location = 'Hong Kong'
      };
      if (node.Nickname === 'YDiot(云端物联）') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/YDiot.png';
        node.Location = 'China'
      };
      if (node.Nickname === '曲率区动') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Curvature_Zone.png';
        node.Location = 'China'
      };
      if (node.Nickname === '区块链研习社') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Chainclub.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'BIT.GAME') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/BIT.GAME.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'F2Pool') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/F2Pool.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'BTC.com') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/BTC1.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'ELAFISH') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/ELAFISH_1.png';
        node.Location = 'Canada'
      };
      if (node.Nickname === 'NextGenius') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Next%20Genius.png';
        node.Location = 'Australia'
      };
      if (node.Nickname === 'ElaChat') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/ELAChat.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'AIoTV(视九TVbox)') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/ShijuiTV.png';
        node.Location = 'China'
      };
      if (node.Nickname === '比特头条BITETT ') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Bitett.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'ELAlliance 大水瓢') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/ELAlliance.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'Long ELA，Short the world(追风筝的人)') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Crypto_World1.png';
        node.Location = 'Germany'
      };
      if (node.Nickname === 'StorSwift (Elastos HIVE)') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/StorSwift.png';
        node.Location = 'China'
      };
      if (node.Nickname === 'viewchain') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/viewchain.png';
        node.Location = 'Singapore'
      };
      if (node.Nickname === 'Famous Amos') {
        node.imageUrl = 'data:image/png;base64,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';
        node.Location = 'Trinidad'
      };
      if (node.Nickname === 'eladapp.org') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/eladapp.png'
        node.Location = 'United States'
      };
      if (node.Nickname === 'ELA.SYDNEY') {
        node.Location = 'Australia'
      };
      if (node.Nickname === 'Orion Supernode') {
        node.Location = 'France'
      };
      if (node.Nickname === 'Elastos Contributors') {
        node.Location = 'Japan'
      };
      if (node.Nickname === 'Ela-Mao') {
        node.Location = 'China'
      };
      if (node.Nickname === 'ManhattanProjectFund') {
        node.Location = 'United States'
      };
      if (node.Nickname === '河北社区') {
        node.Location = 'China'
      };
      if (node.Nickname === 'ELA.GOLD') {
        node.Location = 'Switzerland'
      };
      if (node.Nickname === 'Orchard - Elastos Business Development') {
        node.Location = 'Netherlands'
      };
      if (node.Nickname === 'KANG') {
        node.Location = 'China'
      };
      if (node.Nickname === '虎哥') {
        node.Location = 'China'
      };
      if (node.Nickname === '亦来力-ELAPower') {
        node.Location = 'China'
      };
      if (node.Nickname === 'ELA new internet') {
        node.Location = 'Pitcairn Islands'
      };
      if (node.Nickname === 'To the Moon') {
        node.Location = 'China'
      }
      if (node.Nickname === 'Cape of Good Hope') {
        node.Location = 'South Africa'
      };
      if (node.Nickname === 'ELABay') {
        node.Location = 'Canada'
      };
      if (node.Nickname === 'BOHUI') {
        node.Location = 'China'
      };
      if (node.Nickname === '云上') {
        node.Location = 'China'
      };
      if (node.Nickname === 'Elastos Blockchain') {
        node.Location = 'China'
      };
      if (node.Nickname === 'HicKs乡巴佬') {
        node.Location = 'China'
      };
      if (node.Nickname === 'llamamama') {
        node.Location = 'United States'
      };
      if (node.Nickname === 'The land of abundance') {
        node.Location = 'China'
      };
      if (node.Nickname === '韭菜必赢WE WILL WIN') {
        node.Location = 'China'
      };
      if (node.Nickname === '文亦') {
        node.Location = 'China'
      };
      if (node.Nickname === 'silence') {
        node.Location = 'China'
      };
      if (node.Nickname === 'The future is coming 未来亦来') {
        node.Location = 'China'
      };
      if (node.Nickname === 'Ken.Tan') {
        node.Location = 'China'
      };
      if (node.Nickname === 'Nights Watch 守夜人') {
        node.Location = 'China'
      };
      if (node.Nickname === '米（粒）力联盟') {
        node.Location = 'China'
      };
      if (node.Nickname === 'ela') {
        node.Location = 'China'
      };
      if (node.Nickname === '我爱云') {
        node.Location = 'China'
      };
      if (node.Nickname === '群山') {
        node.Location = 'China'
      };
      if (node.Nickname === 'ELADAO') {
        node.Location = 'China'
      };
      if (node.Nickname === '币.天下') {
        node.Location = 'China'
      };
      if (node.Nickname === 'cryptocalnews') {
        node.Location = 'Canada'
      };
      if (node.Nickname === 'Blockchain007') {
        node.Location = 'China'
      }
      if (node.State !== 'Active') {
        node.Location = 'Inactive';
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
