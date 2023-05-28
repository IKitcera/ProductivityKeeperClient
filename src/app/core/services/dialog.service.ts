import {Injectable, OnDestroy} from "@angular/core";
import {Observable} from "rxjs";
import {SingleInputDialogComponent} from "../../common-components/single-input-dialog/single-input-dialog.component";
import {dialogObservableWrap$} from "../functions/observable-helper.functions";
import {MatDialog} from "@angular/material/dialog";
import {ComponentType} from "@angular/cdk/overlay";
import {
  SimpleConfirmationDialogComponent
} from "../../common-components/simple-confirmation-dialog/simple-confirmation-dialog.component";

@Injectable()
export class DialogService {
  constructor(private dialog: MatDialog) { }

  ngOnDestroy(): void { }

  openSimpleInputDialog(label: string, text: string | null = null): Observable<any> {
    return this.openDialog(SingleInputDialogComponent,
      {
        data: {label, text},
        width: '60%'
      });
  }

  openSimpleConfirmationDialog(label: string): Observable<boolean> {
    return this.openDialog(SimpleConfirmationDialogComponent,
      { data: {label} }
    );
  }

  openDialog<T>(componentType: ComponentType<T>, config: any): Observable<any> {
    const dialog = this.dialog.open(componentType, config);
    return dialogObservableWrap$(dialog.afterClosed(), dialog);
  }
}
