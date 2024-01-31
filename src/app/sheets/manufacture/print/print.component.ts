import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {DomSanitizer} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-print-sheet',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.less']
})
export class PrintSheetComponent {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { data: { wbUrl: string, ozonUrl: string } },
    private bottomSheetRef: MatBottomSheetRef<PrintSheetComponent>,
    public http: HttpClient
  ) {
  }

  close() {
    this.bottomSheetRef.dismiss();
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
