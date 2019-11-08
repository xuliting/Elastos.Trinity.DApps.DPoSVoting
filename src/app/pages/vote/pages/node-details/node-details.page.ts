import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NodesService } from 'src/app/nodes.service';

declare let appService: any;

@Component({
  selector: 'app-node-details',
  templateUrl: './node-details.page.html',
  styleUrls: ['./node-details.page.scss'],
})
export class NodeDetailsPage implements OnInit {

  node = null;

  constructor(
    private nodesService: NodesService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('nodeId')) {
        this.navCtrl.navigateBack('/vote');
        return;
      }
      this.node = this.nodesService.getNode(paramMap.get('nodeId'));
      console.log(this.node);
    });
  }

  closeApp() {
    appService.close();
  }

}
