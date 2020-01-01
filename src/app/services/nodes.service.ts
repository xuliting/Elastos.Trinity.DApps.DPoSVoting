import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { StorageService } from 'src/app/services/storage.service';
import { Node } from '../models/nodes.model';

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
        node.imageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAVFBMVEVN0Mr///9AzsjB7Oo6zcbu+fmY4d1f1M/1/PxV083S8/HL7+2p5uNEzsjj9/ZO0ct929fe9vTD7Oq16eaR39tz2dSH3tmj5eFq19KW4t7O8O6g4+ACB3vVAAACm0lEQVR4nO3d6XKbMBRAYSTAGMeXzUsWv/971s10mrQBZAXpsuR8PzuZXp3ByBAydpIAAAAAAAAAAAAAAAAAAAAAADZGxN5l8vEvNpvs/j+KDM/UIzarm9vpqa3y898F2TSfqmoP6XF3STI7a6bY5Jrm5o/dR+GbCaVKr/VskSJN93kxnwqfghX+djjXdo4+e67+XUi0QmP2p0K9MbtU/y8jYuFdqnscpe6+riFuoTHPinurbfKeFcQuNNWL1mHMnnsXEL3QmJtOok37xysUmi5TCJSh5WsUmraOHmh79hjFQlOVkQOz0+BsnUJTxQ20r8OjlQpNFfNclMvIZK1C00XcUeXLhcwchWYXLdEeR+eqFZoiVmE5OlaxsI10EIfe6vULzTXOJer4IVQtjLOfjp+FuoVxDqL03VDMVXiIcCZK4xiqWhhjO3W9SJULd+FfprZdVGGEl2m5X1RhHv426sU1U7cw/Ino3Gi0C5vQJ6LcFlYYfKsR11aqXXgMXei4KDWRnlsMS0Nvpj6Fcjx8W+XashdRmLw/UPymrHh1vfMuoHAasc0DB3LNhffGwp247sIH3n3XXui+Cl59oZy3XpjI5guzsV/NbqLQeeW3/sLhR0AbKZTtF7ruZSj0RiGFviik0B+FFPqikEJ/FFLoi8L1Fzr/bGDewrKYrFz0Pb49uH42gHkLNZ6QUkghhRRSSCGFFFJIIYUUUkghhRRSSCGFFFJIIYUUPlLY7QNYcmFSTlcv+/lhiHmbL9z+U24KKfRHIYW+KKTQH4UU+qKQQn8UUuiLQgr9UUihLwop9PcDCgc/bX6mwuCf6i0nx7f77M9hC2/78Xmn4B9gKq5vaAo80TVvri8QAgAAAAAAAAAAAAAAAAAAAABM9AvNH1VDbEuFLwAAAABJRU5ErkJggg==';
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
        node.imageUrl = 'data:image/jpeg;base64,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';
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
        node.imageUrl = 'https://i.imgur.com/cHRF2Ov.jpg';
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
