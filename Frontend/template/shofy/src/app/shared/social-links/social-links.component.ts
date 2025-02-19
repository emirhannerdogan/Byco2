import { style } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.scss']
})
export class SocialLinksComponent {
  buttonStyle(arg0: any): { [klass: string]: any; } | null | undefined {
    return arg0.style;
  }
  pressedStyle(arg0: any): { [klass: string]: any; } | null | undefined {
    return arg0.hoverstyle;
  }

  hovered: number = -1;

  public social_data = [
    {
      id: 1,
      link: 'https://www.facebook.com/bycomuhendislik',
      icon: 'fa-brands fa-facebook-f',
      title: 'Facebook',
      style: {
        'background': 'transparent'
      },
      hoverstyle: {
        'background': '#1877F2'
      }
    },
    {
      id: 2,
      link: 'https://x.com/byco_as',
      icon: 'fa-brands fa-twitter',
      title: 'Twitter',
      style: {
        'background': 'transparent'
      },
      hoverstyle: {
        'background': 'black'
      }
    },
    {
      id: 3,
      link: 'https://www.linkedin.com/company/byco',
      icon: 'fa-brands fa-linkedin-in',
      title: 'Linkedin',
      style: {
        'background': 'transparent'
      },
      hoverstyle: {
        'background': ' #007bb5'
      }
    },
    {
      id: 4,
      link: 'https://www.instagram.com/byco_elektrik/',
      icon: 'fa-brands fa-instagram',
      title: 'Vimeo',
      style: {
        'background': 'transparent'
      },
      hoverstyle: {
        'background': '#e1306c'
      }
    },
  ]
}
