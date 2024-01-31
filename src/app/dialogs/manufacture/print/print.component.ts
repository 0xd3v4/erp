import {Component, Inject} from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.less']
})
export class PrintDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: { wbUrl: string, ozonUrl: string } },
  ) {
  }

  close() {
    this.dialogRef.close();
  }
  private printBase64(data: string) {
    fetch(data)
      .then(res => res.blob())
      .then(blob => {
        console.log(blob);
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank')?.print();
      });
  }
  printOzon() {
    this.printBase64(this.data.data.ozonUrl)
  }
  printWb() {
    this.printBase64(this.data.data.wbUrl)
  }

}
