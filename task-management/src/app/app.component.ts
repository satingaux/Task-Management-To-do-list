import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'task-management';

  constructor(private http: HttpClient,
              private afs: AngularFirestore,
              private deviceService: DeviceDetectorService) {}

  ngOnInit()  {
    this.http.get<{ip: string}>('https://jsonip.com').subscribe( data => {
      this.afs.collection('track').doc(data.ip).collection('time_stamp').add({
        time_stamp: new Date(),
        deviceInfo: this.deviceService.getDeviceInfo(),
        isMobile: this.deviceService.isMobile(),
        isTablet: this.deviceService.isTablet(),
        isDesktopDevice: this.deviceService.isDesktop(),
      });
    });
  }
}
