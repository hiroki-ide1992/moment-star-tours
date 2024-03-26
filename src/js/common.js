
/* SCSS import
===================================== */
import '../scss/common.scss';


/* 定義
===================================== */
const DATE = new Date();
const year = DATE.getFullYear();
const month = DATE.getMonth() + 1;
const day = DATE.getDate();;
const $animationControlTag = $('.js-animationControl');
let itemCount = 2;
let viewHeight = $(window).height();
const $audio = $('#BUMP_OF_CHICKEN').get(0);
const $middleEnd = $('.js-middleEnd');
let tourInterval;



/* Class
===================================== */
/**
 * [StarTours 星座描画用クラス]
 * @class
 */
let StarTours = () => {
  'use strict'
}

/**
 * [sortData]
*/
StarTours.prototype.sortData = function(data) {
  let directionSortData;
  let threeArray = [];
  let threeSetData = [];
  let altitudeSortData = [];

  directionSortData = _.sortBy(data, function(starData){
    return starData.directionNum;
  });

  _.each(directionSortData, function(item) {
    if(threeArray.length > 2){


      threeSetData.push(threeArray)
      threeArray = [];
    } else if(threeArray.length <= 2){
      threeArray.push(item);
    }
  });

  _.each(threeSetData, function(item) {
    altitudeSortData.push(_.sortBy(item,function(starData){
      return starData.altitudeNum;
    }));
  });

  return altitudeSortData;
}

/**
 * [dateTextAnimationTagSet]
*/
StarTours.prototype.dateTextAnimationTagSet = function(dateArray) {
  _.each(dateArray, function(options){
    _.each(String(options.date).split(''), function(text){
      $(options.appendClass).before(`<div class="dateGradation__text js-removeDate">${text}</div>`);
    });
  });
};

/**
 * [starView]
*/
StarTours.prototype.starView = function(target, itemCount) {
  $('#js-constellation').removeClass('-zoomIn');
    target.css('display','none');
    target.eq(itemCount).css('display','flex');
    setTimeout(function(){
      $('#js-constellation').addClass('-zoomIn');
    }, 7000);
};

/**
 * [endTour]
*/
StarTours.prototype.endTour = function(target, itemCount) {
  $('.js-finImage').fadeIn(1000);
  $middleEnd.fadeOut(1500);

  const timerid = setInterval(()=>{
    $audio.volume -= 0.01;
  }, 300);
  setTimeout(function(){
    clearInterval(timerid);
    $audio.pause();
    $audio.currentTime = 0;
  }, 6000);

  const endAnimatePromise = new Promise((resolve, reject)=>{
    setTimeout(function(){
      $animationControlTag.removeClass('-scene03');
      resolve();
    }, 2000);
  }).then(()=>{
    return new Promise((resolve, reject)=>{
      setTimeout(function(){
        $('.js-finImage').fadeOut(1000);
        resolve();
      }, 3000);
    });
  }).then(()=>{
    return new Promise((resolve, reject)=>{
      setTimeout(function(){
        $animationControlTag.removeClass('-scene01');
        resolve();
      }, 2000);
    });
  });
};

/**
 * [getStarData]
 */
StarTours.prototype.getAjax = function(callback) {
  'use strict';
  /* navigator.geolocation.getCurrentPosition(
    (position) => {
      $.ajax({
          //url: `https://livlog.xyz/hoshimiru/constellation?lat=${position.coords.latitude}&lng=${position.coords.longitude}&date=${year + '-' + month + '-' + day}&hour=${DATE.getHours()}&min=${DATE.getMinutes()}&disp=off`
          url: `https://livlog.xyz/hoshimiru/constellation?lat=35&lng=139&date=${year + '-' + month + '-' + day}&hour=${DATE.getHours()}&min=${DATE.getMinutes()}&disp=off`
        }).done(function(response){
          callback(response.result);
        });
    },
    (error) => {console.log(error);}
  ); */
  $.ajax({
    url: `https://livlog.xyz/hoshimiru/constellation?lat=35&lng=139&date=${year + '-' + month + '-' + day}&hour=${DATE.getHours()}&min=${DATE.getMinutes()}&disp=off`
  }).done(function(response){
    callback(response.result);
  });
}


/* 実行
===================================== */
window.addEventListener('DOMContentLoaded', function() {

  // geolocation の使用可否判定
  //if ("geolocation" in navigator) {

    const starTours = new StarTours();

    starTours.getAjax(function(responseData){
      const template = _.template($('.js-constellationTemplate').html());
      $('#js-constellation').html(template({items: starTours.sortData(responseData)}));
    });

    $animationControlTag.css('height',`${viewHeight}px`)

    // クリックイベント
    $('.js-tourStart').on('click', ()=>{

      // アニメーションスタート
      const tourPromise = new Promise((resolve, reject)=>{
        // BGMスタート
        $audio.play();
        $audio.volume = 0.2;

        // アニメーション用のDATE情報をセット
        StarTours.prototype.dateTextAnimationTagSet([
          {
            date: year,
            appendClass: '.js-setYear'
          },
          {
            date: month,
            appendClass: '.js-setMonth'
          },
          {
            date: day,
            appendClass: '.js-setDay'
          },
          {
            date: DATE.getHours(),
            appendClass: '.js-seteHours'
          },
          {
            date: DATE.getMinutes(),
            appendClass: '.js-seteMinutes'
          }
        ]);
        resolve();
      });

      tourPromise.then(()=>{
        $animationControlTag.addClass('-scene01');
      }).then(()=>{
        return new Promise((resolve)=>{
          setTimeout(function(){
            $animationControlTag.addClass('-scene02');
            resolve();
          }, 3500);
        });
      }).then(()=>{
        return new Promise((resolve)=>{
          setTimeout(function(){
            $animationControlTag.removeClass('-scene02');
            resolve();
          }, 3000);
        });
      }).then(()=>{
        return new Promise((resolve)=>{
          setTimeout(function(){
            $animationControlTag.removeClass('-scene02');
          $animationControlTag.addClass('-scene03');
          $middleEnd.fadeIn(1500);
          resolve();
          }, 2000);
        });
      }).then(()=>{
        return new Promise((resolve)=>{
          const $constellationItems = $('.js-constellationItem');
          const itemMaxCount = $constellationItems.length;

          setTimeout(function(){
            StarTours.prototype.starView($constellationItems, itemCount);
            itemCount++;

            tourInterval = setInterval(function(){
              StarTours.prototype.starView($constellationItems, itemCount);
              itemCount++;
              if(itemMaxCount < itemCount){
                clearInterval(tourInterval);
                resolve();
              };
            }, 12000);
          }, 5000);
        });
      }).then(()=>{
        StarTours.prototype.endTour();
      }).then(()=>{
        itemCount = 2;
        $('.js-removeDate').remove();
      });
    });

    $middleEnd.on('click', ()=>{
      itemCount = 2;
      clearInterval(tourInterval);
      $('.js-constellationItem').fadeOut(300);
      $('.js-removeDate').remove();
      StarTours.prototype.endTour();
    });

  //} else {alert('この端末では位置情報を取得出来ないためご利用できません')}
});
