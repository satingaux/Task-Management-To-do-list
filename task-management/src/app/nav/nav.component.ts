import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent  implements OnInit{

  constructor(private breakpointObserver: BreakpointObserver,
              private formBuilder: FormBuilder ) { }
  isExpanded = true;
  startDate = new Date();

  form: FormGroup;
  titleControl = new FormControl(null, Validators.required);
  subtitleControl = new FormControl(null, Validators.max(10));
  descriptionControl = new FormControl(null, Validators.required);
  dateControl = new FormControl(null,  Validators.required);

  data: {
    timeStamp: '',
    title: '',
    subtitle: '',
    description: '',
    date: ''
  }
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit()  {
    this.form = this.formBuilder.group({
      title: this.titleControl,
      subtitle: this.subtitleControl,
      description: this.descriptionControl,
      date: this.dateControl,
    });
  }

  createTask()  {
    console.log(this.form.getRawValue());
    this.form.reset();
  }
}
