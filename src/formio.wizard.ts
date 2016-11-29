import { Component, Input, Output, EventEmitter, OnInit, ElementRef }  from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormioService } from './formio.service';
import { FormioForm, FormioEvents } from './formio.common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'formio-wizard',
    template: '<div></div>'
})
export class FormioWizardComponent implements OnInit {
    public formGroup: FormGroup = new FormGroup({});
    public events: FormioEvents = new FormioEvents();
    public ready: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public page: any;
    public pages: Array<any> = [];
    public currentPage: number;
    public storage: Object = {};
    public data: Object = {};
    @Input() form: FormioForm = null;
    @Input() submission: any = {};
    @Input() src: string;
    @Input() service: FormioService;
    @Output() change: EventEmitter<any> = new EventEmitter();

    constructor(private elementRef: ElementRef) {}
    ngOnInit() {
        this.currentPage = 0;
        this.page = this.form.components[0];
        this.form.components.forEach((item: any) => {
            this.pages.push(item);
        });
        if (this.src) {
            this.service = new FormioService(this.src);
            this.pages.splice(this.pages.length-1, 1);
        }
    }
    onChange(page: any, event: any) {
        this.storage['page'] = this.pages.indexOf(page) + 1;
        this.data[event.target.id] = event.target.value;
        this.storage['data'] = this.data;
        localStorage.setItem('wizard', JSON.stringify(this.storage));
    }
    public checkErrors(): boolean {
        //@TODO: Check validations...
        return false;
    }
    public next() {
        if (this.checkErrors()) {
            return;
        }
        if (this.currentPage >= (this.pages.length - 1)) {
            return;
        }
        this.currentPage++;
        this.page = this.pages[this.currentPage];
    }
    public prev() {
        this.submission = this.data;
        if (this.currentPage < 1) {
            return;
        }
        this.currentPage--;
        this.page = this.pages[this.currentPage];
    }
    public onSubmitWizard() {
        if (this.checkErrors()) {
            return;
        }
        localStorage.setItem('wizard','');
        let submission = {data: this.data};
        if (this.service) {
            this.service.saveSubmission(submission).subscribe((sub: {}) => {});
        }
    }
}