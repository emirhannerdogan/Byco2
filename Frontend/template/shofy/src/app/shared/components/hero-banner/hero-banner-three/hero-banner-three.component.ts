import { Component, ElementRef, ViewChild,QueryList } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';

@Component({
  selector: 'app-hero-banner-three',
  templateUrl: './hero-banner-three.component.html',
  styleUrls: ['./hero-banner-three.component.scss']
})
export class HeroBannerThreeComponent {

  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  public swiperInstance: Swiper | undefined;

  // slider data
  public slider_data = [
    {
      id: 1,
      bg: "/assets/img/banner/banner1.png",
      subtitle: "Sonuç odaklı ve gerekli tüm bakımların kendi\
       bünyemizde sizlere sunulacağının taahhütünü vermek bizlerin\
       markalaşma sürecindeki en büyük yapı taşının olduğuna inanmaktayız.",
      title: "img",
    },
    {
      id: 2,
      bg: "/assets/img/banner/banner2.png",
      subtitle: "Sonuç odaklı ve gerekli tüm bakımların kendi\
       bünyemizde sizlere sunulacağının taahhütünü vermek bizlerin\
       markalaşma sürecindeki en büyük yapı taşının olduğuna inanmaktayız.",
      title: "img",
    },
    
    {
      id: 3,
      bg: "/assets/img/banner/banner5.png",
      subtitle: "Awesome Beauty Products",
      title: "img",
    }
    // {
    //   id: 3,
    //   bg: "/assets/img/banner/Sequence_01.mp4",
    //   subtitle: "Sonuç odaklı ve gerekli tüm bakımların kendi\
    //    bünyemizde sizlere sunulacağının taahhütünü vermek bizlerin\
    //    markalaşma sürecindeki en büyük yapı taşının olduğuna inanmaktayız.",
    //   title: "video",
    // }
  ]
  

  ngAfterViewInit() {
    if (this.swiperContainer) {
      this.swiperInstance =  new Swiper('.tp-slider-active-3', {
        slidesPerView: 1,
        spaceBetween: 30,
        effect: 'fade',
        modules: [Pagination, EffectFade],
        pagination: {
          el: ".tp-slider-3-dot",
          clickable: true
        },
        breakpoints: {
          768: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          480: {
            slidesPerView: 1,
            spaceBetween: 10,
          }
        }
      });
    }
  }
}
