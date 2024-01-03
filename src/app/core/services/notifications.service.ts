import {Inject, Injectable, InjectionToken, LOCALE_ID} from "@angular/core";
import {TaskItem} from "../models/task.model";
import {from, Observable, of, switchMap, tap} from "rxjs";
import {Config} from "../../../configs/config";
import {filter} from "rxjs/operators";
import {SwPush} from "@angular/service-worker";

@Injectable()
export class NotificationsService {

  // We must manage existing intervals updates
  private existingTimeouts = new Map<number, any>();

  constructor(private sw: SwPush, @Inject(LOCALE_ID) private locale: string) {
    this.sw.messages.pipe(
      tap(m => {
        console.log('in sub message', m);

      })
    ).subscribe();
  }

  public showNotification(task: TaskItem): Observable<any> {
    const showNotification$ = from(
      this.sw.requestSubscription({
        serverPublicKey: Config.publicKey
      })
    ).pipe(
      tap(_ => {
        const title = `${task.text} 📌`;

        const body = `${new Date(task.deadline).toLocaleString(this.locale)} ${task.executionDuration ? '(' + task.executionDuration.toString() + ' hrs)' : ''}`;
        const notification = new Notification(
          title, {
            body,
            icon: "assets/ntf-reminder.png",
            vibrate: [50, 100, 120, 100, 50, 100, 50],
            tag: task.tags.map(t => t.text).join(', ')
          });
      })
    );

    const permission$ = Notification.permission === 'granted'
      ? of('granted')
      : from(Notification.requestPermission());

    return permission$.pipe(
      filter(result => result === 'granted'),
      switchMap(_ => showNotification$)
    );
  }

  public scheduleNotification(task: TaskItem, showEarlierOnMins: number): void {
    if (task.isChecked || !task.deadline || new Date(task.deadline) < new Date()) {
      return;
    }

    if (this.existingTimeouts.has(task.id)) {
      clearTimeout(this.existingTimeouts.get(task.id));
    }

    let timeout = new Date(task.deadline).getTime() - showEarlierOnMins * 60 * 1000;
    timeout = Math.max(timeout - Date.now(), 0);
    const timeoutId = setTimeout(
      () => this.showNotification(task).subscribe(),
      timeout
    );

    this.existingTimeouts.set(task.id, timeoutId);
  }
}
