import { Component } from '@angular/core';
import { IBlogType } from '@/types/blog-type';
import { ActivatedRoute, Router } from '@angular/router';
import blogData from '@/data/blog-data';

@Component({
  selector: 'app-dynamic-blog-details',
  templateUrl: './dynamic-blog-details.component.html',
  styleUrls: ['./dynamic-blog-details.component.scss']
})
export class DynamicBlogDetailsComponent {


  
  constructor(private route: ActivatedRoute) {}

  type =  "gizlilik";

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type') || 'defaultType';
      console.log(this.type);
    });
  }

  
}
