import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.less']
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { header: string, message: string, buttons: string[] },
  ) {
  }

  action(button: string) {
    this.dialogRef.close(button)
  }
}
