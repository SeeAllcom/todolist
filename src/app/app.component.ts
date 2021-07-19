import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';

enum VIEW_STATE {
  Main = 'main',
  AddNewItemTemplate = 'addNewItemTemplate',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  @ViewChild('main', {static: true}) main: TemplateRef<AppComponent>;
  @ViewChild('addNewItemTemplate', {static: true}) addNewItemTemplate: TemplateRef<AppComponent>;

  readonly VIEW_STATE = VIEW_STATE;
  currentState: VIEW_STATE = VIEW_STATE.Main;
  addItemForm = this.formBuilder.group({
    item: new FormControl('', [Validators.required]),
  });
  todoListItems = this.formBuilder.group({
    items: this.formBuilder.array([])
  });
  listItems = this.todoListItems.controls.items as FormArray;
  items = this.todoListItems.get('items')['controls'];
  isFormInvalid = false;
  doneItems: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  changeTemplate(state: VIEW_STATE): void {
    this.currentState = state;
  }

  createItem(item: string): FormGroup {
    return this.formBuilder.group({
      title: item,
    });
  }

  addItemToLIst(): void {
    if (this.addItemForm.valid) {
      this.isFormInvalid = false;
      this.listItems.push(this.createItem(this.addItemForm.controls.item.value));
      this.changeTemplate(VIEW_STATE.Main);
      this.addItemForm.controls.item.setValue('');
    } else {
      this.isFormInvalid = true;
    }
  }

  deleteItemToList(i): void {
    this.listItems.removeAt(i);
  }

  doneItem(value: string): void {
    this.doneItems.push(value);
  }

  openConfirmDeleteDialog(index: number): void {
    this.dialog.open(DeleteConfirmDialogComponent, {data: {index, listItems: this.listItems}});
  }
}
