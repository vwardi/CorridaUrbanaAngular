import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Event} from '../model/event.model';
import {ActivatedRoute} from '@angular/router';
import {CalendarService} from "./calendar.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {


  eventListOriginal: Event[] = [];
  eventList: Event[] = [];
  loaded = false;
  @ViewChild('inputSearch')
  searchInputRef: ElementRef;

  distancesSelected = [];

  constructor(private calendarService: CalendarService, private renderer: Renderer2, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    console.log(this.route.snapshot.params['uf']);
    if (this.route.snapshot.params['uf'] == null) {
      this.searchEvents('RJ');
    } else {
      this.searchEvents(this.route.snapshot.params['uf']);
    }
  }

  searchEvents(uf: string) {
    this.calendarService.getEventsByUf(uf).then( events => {
        this.loaded = true;
        this.eventListOriginal = events;
        this.eventList = this.eventListOriginal;
        console.log('%cEvent service returned: ' + this.eventListOriginal.length + ' events.', 'color: green');
      }
    );

  }

  filterEvents() {
    this.loaded = false;
    console.log('searching events with name: ' + this.searchInputRef.nativeElement.value);
    this.eventList = this.eventListOriginal.filter(
      c => c.title.toLowerCase().includes(this.searchInputRef.nativeElement.value.toLowerCase())
    );
    this.loaded = true;
    console.log('%cYour search returned: ' + this.eventList.length + ' events.', 'color: red');

  }

  filterState(uf: string) {
    this.loaded = false;
    //reset distance filter
    this.renderer.removeClass(document.querySelector('.curb-filter-distance'), 'curb-filter-distance-selected');
    this.searchEvents(uf.valueOf());
  }


  filterDistance(distance: string, event: any) {
    this.loaded = false;
    this.toggleDistance(distance, event);

    if (this.distancesSelected.length === 0) {
      this.eventList = this.eventListOriginal;
    } else {
      this.eventList = this.eventListOriginal.filter(
        c => c.distances.includes(distance)
      );
    }
    this.loaded = true;
  }

  toggleDistance(distance: string, event: any) {
    if (this.distancesSelected.includes(distance)) {
      this.renderer.removeClass(event.target.parentElement, 'curb-filter-distance-selected');

      this.distancesSelected.splice(this.distancesSelected.indexOf(distance), 1);
    } else {
      this.renderer.addClass(event.target.parentElement, 'curb-filter-distance-selected');
      this.distancesSelected.push(distance);
    }
  }

}
