import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { StorageService } from 'src/app/services/storage.service';
import { Node } from '../models/nodes.model';
import { Vote } from '../models/history.model';
import { Mainchain, Voters, Price, Block } from '../models/stats.model';


@Injectable({
  providedIn: 'root'
})
export class NodesService {

  // Nodes
  public _nodes: Node[] = [];
  public activeNodes: Node[] = [];
  public totalVotes: number = 0;

  // Stats
  public statsFetched: boolean = false;
  public currentHeight: number = 0;
  public mainchain: Mainchain;
  public voters: Voters;
  public price: Price;
  public block: Block;

  // Storage
  private firstVisit: boolean = false;
  public _votes: Vote[] = [
   {
      date: new Date(),
      tx: 'a2677487ba6c406f70b22c6902b3b2ffe582f99b58848bbfba9127c5fa47c712',
      keys: [
        '0368044f3b3582000597d40c9293ea894237a88b2cd55f79a18193399937d22664',
        '03d55285f06683c9e5c6b5892a688affd046940c7161571611ea3a98330f72459f',
        '024b527700491895b79fc5bfde8a60395307c5416a075503e6ac7d1df61c971c78'
      ]
    },
    {
      date: new Date(),
      tx: 'd42da61ad9d12e0adf167d9451506cc119ad6384cae6d57158e643192720cf10',
      keys: [
        '03674a7867f2d4a557764d1f61138b9f98542c9a77e8773953432ac3e48ae60226',
        '02d6f8ff72eaa9aada515d6b316cff2cbc55be09ddab17981d74a585ae20617a72',
        '02a85be1f6244b40b8778b626bde33e1d666b3b5863f195487e72dc0e2a6af33a1'
      ]
    },
    {
      date: new Date(),
      tx: '241315309c645e52fabafe9e8963037829f025526b9b616972b8b7a0965e6ac4',
      keys: [
        '026c8ce246d2587df8a669eee82be4f365ab6cf4fc45e3e539cf0ab91fbab3a809',
        '0315067144eaad471ed0c355e6f9822c51b93308e0cd9febf0792304c605973916',
        '030cda9b67897652dbf9f85cb0aba39a09203004f59366517a5461b1e48d9faa64',
        '02b6052f5f65089be3b94efb91c98a5f94c0bf7fbefdbd85c1d547aa7b3d547710'
      ]
    }
  ];

  // Fetch
  private nodeApi: string = 'https://node1.elaphant.app/api/';
  private elaNodeUrl: string = 'https://elanodes.com/wp-content/uploads/custom/images/';
  private proxyurl = "https://cors-anywhere.herokuapp.com/";

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
  ) {}

  get nodes(): Node[] {
    return [...this._nodes.filter((a,b) => this._nodes.indexOf(a) === b)];
  }

  getNode(id: string): Node {
    return {...this._nodes.find(node => node.Producer_public_key === id)};
  }

  getVote(id: string): Vote {
    return {...this._votes.find(vote => vote.tx === id)};
  }

  async init() {
    this.getVisit();
    this.getStoredVotes();
    this.fetchStats();

  /*   setInterval(() => {
      this.fetchStats();
    }, 5000); */

    const height: number = await this.fetchCurrentHeight();
    this.fetchNodes(height);
  }

   // Storage
   getVisit() {
    this.storageService.getVisit().then(data => {
      if(data || data === true) {
        this.firstVisit = false;
        console.log('First visit?', this.firstVisit);
      } else {
        this.router.navigate(['menu/home']);
      }
    });
   }

   getStoredVotes() {
    this.storageService.getVotes().then(data => {
      console.log('Vote history', data);
      if(data && data.length > 0) {
        this._votes = data;
      }
    });
  }

  getStoredNodes() {
    this.storageService.getNodes().then(data => {
      console.log(data);
      this._nodes.map(node => {
        if (data && data.includes(node.Ownerpublickey) && node.State === 'Active') {
          node.isChecked = true;
        }
      });
    });
  }

  fetchStats() {
    return new Promise((resolve, reject) => {
      this.http.get<any>(this.proxyurl + 'https://elanodes.com/api/widgets').subscribe((res) => {
        console.log(res);
        this.statsFetched = true;
        this.mainchain = res.mainchain;
        this.voters = res.voters;
        this.price = res.price;
        this.block = res.block;
        resolve();
      });
    });
  }

  fetchCurrentHeight(): Promise<number> {
    console.log('Fetching height');
    return new Promise((resolve, reject) => {
      this.http.get<any>(this.nodeApi + '1/currHeight').subscribe((res) => {
        console.log('Current height fetched' + res.result);
        this.currentHeight = res.result;
        resolve(res.result);
      }, (err) => {
        console.log(err);
        reject(err);
      });
    });
  }

  fetchNodes(height: number) {
    console.log('Fetching Nodes..');
    this.http.get<any>(this.nodeApi + 'v1/dpos/rank/height/' + height).subscribe((res) => {
      console.log('Nodes Fetch Response', res)
      this._nodes = this._nodes.concat(res.result);
      this.activeNodes = this._nodes.filter(node => node.State === 'Active');
      this.getNodeIcon();
      this.getStoredNodes();
      this.getTotalVotes(res.result);
      console.log('Nodes Added..', this._nodes);
      console.log('Active Nodes..', this.activeNodes);
    });
  }

  getTotalVotes(nodes: Node[]) {
    nodes.map(node => {
      this.totalVotes += parseFloat(node.Votes);
    });
    console.log('Total votes counted', this.totalVotes);
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
        node.imageUrl = 'https://i.ibb.co/hcVLkJP/download.png';
        node.Location = 'Hong Kong'
      };
      if (node.Nickname === 'Wild Strawberries Atlas') {
        node.imageUrl = 'https://i.ibb.co/qDdmLQJ/EPpf-VIMW4-AIx-J30.jpg';
        node.Location = 'United States'
      };
      if (node.Nickname === 'Enter Elastos - Ganymede') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Enter%20Elastos.png';
        node.Location = 'Australia'
      };
      if (node.Nickname === 'Wild Strawberries Apollo') {
        node.imageUrl = 'https://i.ibb.co/F7L83NH/EPpf-VIa-Wk-AAUM3d.jpg';
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
        node.imageUrl = 'https://i.ibb.co/ZfCj6Yj/EPpf-VJGXs-AEq0-X1.jpg';
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
        node.imageUrl = 'https://i.ibb.co/qF16Mgn/download-1.png';
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
        node.imageUrl = 'https://i.ibb.co/jRdhF7L/download-2.png';
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
        node.imageUrl = 'https://i.ibb.co/yq6z86Y/thumbnail.png';
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
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/BitWork_1.png';
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
        node.imageUrl = 'https://i.ibb.co/0sddwC5/download.jpg';
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
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Orchard.png';
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
      if (node.Nickname === 'Dragonela') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/dragonela.png';
        node.Location = 'United States'
      }
      if (node.Nickname === 'Daily Rewards') {
        node.imageUrl = 'https://elanodes.com/wp-content/uploads/custom/images/Daily_Rewards.png';
        node.Location = 'Japan'
      }
      if (node.Nickname === 'United Kingdom') {
        node.imageUrl = 'https://cdn.pixabay.com/photo/2015/11/06/13/29/union-jack-1027898_1280.jpg';
        node.Location = 'United Kingdom'
      }
      if (node.Nickname === 'ELA2020') {
        node.Location = 'China'
      }
      if (node.State !== 'Active') {
        node.Location = 'Inactive';
      }
    });
  }
}
