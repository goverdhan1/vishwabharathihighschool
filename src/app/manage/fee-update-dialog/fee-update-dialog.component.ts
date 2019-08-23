import { Component, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FeeService } from '../../services/fee.service';

export interface DialogData {
  enrollId: string;
  id: string;
  month: string;
  amt: number;
  status: string;
}

@Component({
  selector: 'app-fee-update-dialog',
  templateUrl: './fee-update-dialog.component.html',
  styleUrls: ['./fee-update-dialog.component.css']
})
export class FeeUpdateDialogComponent implements OnDestroy {
  feeStatus = ['Paid', 'Due', 'Partial Paid'];
  querySubscription;
  error;
  errorMessage;
  dataLoading;
  constructor(
    public dialogRef: MatDialogRef<FeeUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private feeService: FeeService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateFee(formData): void {
    console.log(formData);
    const dataObj = {};
    dataObj[this.data.month] = {amount: formData.amount, status: formData.status};
    console.log(dataObj);
    this.querySubscription = this.feeService.updateSpecificMonthFee(this.data.enrollId, this.data.id, dataObj).then((res) => {
      this.dialogRef.close();
      return res;
    }).catch(err => {
      if (err) {
          this.error = true;
          this.errorMessage = err.message;
          this.dataLoading = false;
      }
    });

  }

  ngOnDestroy() {

  }
}
