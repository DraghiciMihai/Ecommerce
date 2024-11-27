import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

initiateSearch(inputName: string) {
  this.router.navigateByUrl(`search/${inputName}`);
}

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
