import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {RoomService} from '../../services/room.service';
import {ModalRef} from '../../../../shared/modal.service';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.sass']
})
export class RoomFormComponent implements OnInit {
  public form: FormGroup;

  constructor(public modalRef: ModalRef, private  roomService: RoomService) {
  }

  ngOnInit() {
    this.form = this.buildForm();
  }

  public save() {
    const values = this.form.getRawValue();
    this.roomService.addRoom(values);
    this.modalRef.close();
  }


  private buildForm() {
    return new FormGroup({
      name: new FormControl(null, [Validators.required])
    });
  }

}
