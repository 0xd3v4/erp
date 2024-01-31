import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IGoodsCounterpartyContacts} from "../../interfaces/Goods";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.less']
})
export class ContactCardComponent implements OnInit{

  @Input() item: Partial<IGoodsCounterpartyContacts> = {};
  @Input() last = false;

  @Output() onUpdate: EventEmitter<Partial<IGoodsCounterpartyContacts>> = new EventEmitter();
  @Output() onRemove: EventEmitter<any> = new EventEmitter();

  contactsForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.contactsForm = formBuilder.group({
      phone: [null],
      name: [null],
    });
  }

  ngOnInit(): void {
     this.contactsForm.patchValue(this.item);
     this.contactsForm.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
       this.onUpdate.emit(value)
     })
  }

  removeContact() {
    this.onRemove.emit()
  }
}
