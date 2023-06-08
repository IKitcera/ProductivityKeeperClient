import { Injectable } from '@angular/core';
import {HttpTransportType, HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {StorageService} from "../storageService";
import {AuthService} from "../authServices";

@Injectable()
export abstract class SignalRService {
  protected abstract hubUrl: string;
  public client: HubConnection;

  constructor(protected auth: AuthService) {
  }

  public start(): Promise<void> {
    if (!this.client) {
      throw new Error('The signalR connection wasn`t build');
    }
    return this.client
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public stop(): Promise<void> {
    return this.client
      .stop()
      .then(() => console.log('Connection stopped'))
      .catch(err => console.log('Error while stopping connection: ' + err));
  }

  public buildClient(): void {
    this.client = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        transport: HttpTransportType.LongPolling,
        accessTokenFactory: () => this.auth.token
      })
      .withAutomaticReconnect()
      .build();
  }
}
