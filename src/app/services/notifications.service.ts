import { Injectable } from '@angular/core';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {PrintSheetComponent} from "../sheets/manufacture/print/print.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../dialogs/confirm/confirm.component";
import {PrintDialogComponent} from "../dialogs/manufacture/print/print.component";
import {UniversalFormDialogComponent} from "../dialogs/universal-form/universal-form.component";
import {UniversalFormSheetComponent} from "../sheets/universal-form/universal-form.component";
import {GoodsWarehouseDialogComponent} from "../dialogs/goods-warehouse-dialog/goods-warehouse-dialog.component";
import {GoodsWarehouseSheetComponent} from "../sheets/goods-warehouse-sheet/goods-warehouse-sheet.component";
import {NewDdsOperationDialogComponent} from "../dialogs/new-dds-operation-dialog/new-dds-operation-dialog.component";
import {NewDdsOperationSheetComponent} from "../sheets/new-dds-operation-sheet/new-dds-operation-sheet.component";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  showPrintingSheet(data: any) {
    this.bottomSheet.open(PrintSheetComponent, {
      data: { data }
    });
  }
  showPrintingDialog(data: any) {
    this.dialog.open(PrintDialogComponent, {
      disableClose: true,
      data: { data }
    });
  }
  showUniversalFormDialog(data: any) {
    return this.dialog.open(UniversalFormDialogComponent, {
      disableClose: true,
      data: { data }
    });
  }
  showUniversalFormSheet(data: any) {
    return this.bottomSheet.open(UniversalFormSheetComponent, {
      disableClose: true,
      data: { data }
    });
  }

  showCreateGoodsWarehouseDialog(data: any) {
    return this.dialog.open(GoodsWarehouseDialogComponent, {
      disableClose: true,
      data
    });
  }
  showCreateGoodsWarehouseSheet(data: any) {
    return this.bottomSheet.open(GoodsWarehouseSheetComponent, {
      disableClose: true,
      data
    });
  }

  showNewDdsOperationDialog(data: any) {
    return this.dialog.open(NewDdsOperationDialogComponent, {
      disableClose: true,
      data
    });
  }
  showNewDdsOperationSheet(data: any) {
    return this.bottomSheet.open(NewDdsOperationSheetComponent, {
      disableClose: true,
      data
    });
  }
  showSnack(message: string, duration?: number, panelClass?: string): void {
    this.snackBar.open(
      message,
      'OK',
      {
        duration: duration || 2000,
        panelClass: [panelClass ? panelClass : 'snackbar'],
      }
    );
  }

  showConfirmWindow(header: string, message: string, buttons: string[]): MatDialogRef<any> {
    return this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirmDialog',
      disableClose: true,
      data: {header, message, buttons}
    })
  }
}
