/*!
 * jQuery Once v2.2.0 - http://github.com/robloach/jquery-once
 * @license MIT, GPL-2.0
 *   http://opensource.org/licenses/MIT
 *   http://opensource.org/licenses/GPL-2.0
 */
(function(e){"use strict";if(typeof exports==="object"){e(require("jquery"))}else if(typeof define==="function"&&define.amd){define(["jquery"],e)}else{e(jQuery)}})(function(e){"use strict";var n=function(e){e=e||"once";if(typeof e!=="string"){throw new TypeError("The jQuery Once id parameter must be a string")}return e};e.fn.once=function(t){var r="jquery-once-"+n(t);return this.filter(function(){return e(this).data(r)!==true}).data(r,true)};e.fn.removeOnce=function(e){return this.findOnce(e).removeData("jquery-once-"+n(e))};e.fn.findOnce=function(t){var r="jquery-once-"+n(t);return this.filter(function(){return e(this).data(r)===true})}});

(function ($, Drupal) {

  'use strict'

  Drupal.behaviors.simplePopupBlocks = {
    attach: function (context, settings) {
      // Global variables
      var popup_settings = drupalSettings.simple_popup_blocks.settings,
        _html = document.documentElement, windowWidth = $(window).width();

      $.each(popup_settings, function (index, values) {

        // No popup when the window width is less than the trigger width.
      if (windowWidth < values.trigger_width) {return null;};

        // Declaring variable inside foreach - so it will not global.
        var modal_class = '',
          block_id = values.identifier,
          visit_counts_arr = values.visit_counts.split(','),
          allow_cookie = true,
          read_cookie = '',
          cookie_val = 1,
          cookie_days = values.cookie_expiry || 100,
          match = 0,
          css_identity = '',
          spb_popup_id = '',
          modal_close_class = '',
          modal_minimize_class = '',
          modal_minimized_class = '',
          layout_class = '',
          class_exists = false,
          delays = '',
          browser_close_trigger = true,
          use_time_frequency = values.use_time_frequency,
          time_frequency = values.time_frequency,
          time_frequency_cookie = 0,
          next_popup = 0,
          current_timestamp = 0,
          show_minimized_button = values.show_minimized_button,
          show_model = true
        // Always show popup, so prevent from creating cookie
        if (visit_counts_arr.length == 1 && visit_counts_arr[0] == 0 && use_time_frequency == 0) {
          allow_cookie = false
        }
        // Check to see if the block exists in the current page.
        var element = document.getElementById(block_id);
        if (typeof(element) != 'undefined' && element != null) {
        // Creating cookie
        if (allow_cookie == true) {
        if (use_time_frequency == 0) {
          read_cookie = readCookie('spb_' + block_id)
          if (read_cookie) {
            cookie_val = + read_cookie + 1
            createCookie('spb_' + block_id, cookie_val, 100)
          }
          else {
            createCookie('spb_' + block_id, cookie_val, 100)
          }
          // Match cookie
          cookie_val = cookie_val.toString()
          match = $.inArray(cookie_val, visit_counts_arr)

          if (match === -1) {
            show_model = false
          }
          }
          else {
          time_frequency_cookie = readCookie('spb_time' + block_id)
          current_timestamp = Math.floor(Date.now() / 1000)
          next_popup = current_timestamp + parseInt(time_frequency, 10)

          if (time_frequency_cookie) {
            // If current_timestamp is greater than cookie time show the popup.
            if (current_timestamp >= time_frequency_cookie) {
              match = 1
            }
            // This should allow the time frequency to be adjusted down after
            // the cookie has been set.
            else if (next_popup <= time_frequency_cookie) {
              match = 1
            }
            else {
              match = -1
              show_model = false
            }

            // Create new cookie for popup.
            if (match === 1) {
              createCookie('spb_time' + block_id, next_popup, 100)
            }
          }
          else {
            createCookie('spb_time' + block_id, next_popup, 100)
          }
          }
        }

        }
        // Set css selector
        css_identity = '.'
        if (values.css_selector == 1) {
          css_identity = '#'
        }

        // Assign dynamic css classes
        spb_popup_id = 'spb-' + block_id
        modal_class = block_id + '-modal'
        modal_close_class = block_id + '-modal-close'
        modal_minimize_class = block_id + '-modal-minimize'
        modal_minimized_class = block_id + '-modal-minimized'
        layout_class = '.' + modal_class + ' .spb-popup-main-wrapper'
        // Wrap arround elements
		$(css_identity + block_id).once().
          wrap($('<div class="' + modal_class + '"></div>'))
        // Hide the popup initially
        $('.' + modal_class).once().hide()

        // Wrap remaining elements
        if ($(css_identity + block_id).closest('.spb-popup-main-wrapper').length) {
          return;
        }
        $(css_identity + block_id).
          wrap($('<div class="spb-popup-main-wrapper"></div>'))
        $('.' + modal_class).
          wrap('<div id="' + spb_popup_id +
            '" class="simple-popup-blocks-global"></div>')
        $(css_identity + block_id).
          before($('<div class="spb-controls"></div>'))

        // Skip code for non popup pages.
        class_exists = $('#' + spb_popup_id).
          hasClass('simple-popup-blocks-global')
        if (!class_exists) {
          return true
        }
        // Minimize button wrap
        if (values.minimize === "1") {
          $("#"+spb_popup_id + " .spb-controls").
            prepend($('<span class="' + modal_minimize_class +
              ' spb_minimize">-</span>'))
          $('.' + modal_class).
            before($('<span class="' + modal_minimized_class +
              ' spb_minimized"></span>'))
        }
        // Close button wrap
        if (values.close == 1) {
          $("#"+spb_popup_id + " .spb-controls").
            prepend($('<span class="' + modal_close_class +
              ' spb_close">&times;</span>'))
        }
        // Overlay
        if (values.overlay == 1) {
          $('.' + modal_class).addClass('spb_overlay')
        }
        // Inject layout class.
        switch (values.layout) {
          // Top left.
          case '0':
            $(layout_class).addClass('spb_top_left')
            $(layout_class).css({
              'width': values.width,
            })
            break
          // Top right.
          case '1':
            $(layout_class).addClass('spb_top_right')
            $(layout_class).css({
              'width': values.width,
            })
            break
          // Bottom left.
          case '2':
            $(layout_class).addClass('spb_bottom_left')
            $(layout_class).css({
              'width': values.width,
            })
            break
          // Bottom right.
          case '3':
            $(layout_class).addClass('spb_bottom_right')
            $(layout_class).css({
              'width': values.width,
            })
            break
          // Center.
          case '4':
            $(layout_class).addClass('spb_center')
            $(layout_class).css({
              'width': values.width,
			  'margin-left': -values.width / 2
            })
            break
          // Top Center.
          case '5':
            $(layout_class).addClass('spb_top_center')
			  $(layout_class).css({
			  'width': values.width,
			  })
            break
          // Top bar.
          case '6':
            $(layout_class).addClass('spb_top_bar')
            $(layout_class).css({})
            break
          // Right bar.
          case '7':
            $(layout_class).addClass('spb_bottom_bar')
            $(layout_class).css({})
            break
          // Bottom bar.
          case '8':
            $(layout_class).addClass('spb_left_bar')
            $(layout_class).css({
              'width': values.width,
            })
            break
          // Right bar.
          case '9':
            $(layout_class).addClass('spb_right_bar')
            $(layout_class).css({
              'width': values.width,
            })
            break
        }
      if (show_model === true) {
        // Automatic trigger with delay
        if (values.trigger_method == 0 && values.delay > 0) {
          delays = values.delay * 1000
          $('.' + modal_class).delay(delays).fadeIn('slow')
            if (values.overlay == 1) {
              setTimeout(stopTheScroll, delays)
            }
        }
        // Automatic trigger without delay
        else if (values.trigger_method == 0) {
            $('.' + modal_class).show()
            $(css_identity + block_id).show()
            if (values.overlay == 1) {
              stopTheScroll()
            }
        }
        // Manual trigger
        else if (values.trigger_method == 1) {
          $(document).on('click', values.trigger_selector, function (e) {
            $('.' + modal_class).show()
            $(css_identity + block_id).show()
            if (values.overlay == 1) {
              stopTheScroll()
            }
            return false;
          })
        }
        // Browser close trigger
        else if (values.trigger_method == 2) {
          $(_html).mouseleave(function (e) {
            // Trigger only when mouse leave on top view port
            if (e.clientY > 20) { return }
            // Trigger only once per page
            if (!browser_close_trigger) { return }
            browser_close_trigger = false
            $('.' + modal_class).show()
            $(css_identity + block_id).show()
            if (values.overlay == 1) {
              stopTheScroll()
            }
          })
        }
        }

        // Trigger for close button click
        $('.' + modal_close_class).click(function () {
          $('.' + modal_class).hide()
          startTheScroll()
        })
        // Trigger for minimize button click
        $('.' + modal_minimize_class).click(function () {
          $('.' + modal_class).hide()
          startTheScroll()
          $('.' + modal_minimized_class).show()
        })
        // Trigger for minimized button click
        $('.' + modal_minimized_class).click(function () {
          $('.' + modal_class).show()
          $(css_identity + block_id).show()
          if (values.overlay == 1) {
            stopTheScroll()
          }

        // Hide the minimized button.
        if (show_minimized_button == 0) {
          $('.' + modal_minimized_class).hide()
        }

        })
        // Trigger for ESC button click
        if (values.enable_escape == 1) {
          $(document).keyup(function (e) {
            if (e.keyCode == 27) { // Escape key maps to keycode `27`.
              $('.' + modal_class).hide()
              startTheScroll()
              $('.' + modal_minimized_class).show()
            }
          })
        }

      // Hide the minimized button.
      if (show_minimized_button == 0) {
        $('.' + modal_minimized_class).hide()
      }

      }) // Foreach end.
    }
  } // document.ready end.

  // Remove the scrolling while overlay active
  function stopTheScroll () {
    $('body').css({
      'overflow': 'hidden',
    });

    $('input:text').focus();
  }

  // Enable the scrolling while overlay inactive
  function startTheScroll () {
    $('body').css({
      'overflow': '',
    })
  }

  // Creating cookie
  function createCookie (name, value, days) {
    if (days > 0) {
      var date = new Date()
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
      var expires = '; expires=' + date.toGMTString()
    }
    else {
      var expires = ''
    }
    document.cookie = name + '=' + value + expires + '; path=/'
  }

  // Reading cookie
  function readCookie (name) {
    var nameEQ = name + '='
    var ca = document.cookie.split(';')
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i]
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length)
      }
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length, c.length)
      }
    }
    return null
  }

})(jQuery, Drupal)
;
/*! skrollr 0.6.30 (2015-08-12) | Alexander Prinzhorn - https://github.com/Prinzhorn/skrollr | Free to use under terms of MIT license */
!function(a,b,c){"use strict";function d(c){if(e=b.documentElement,f=b.body,T(),ha=this,c=c||{},ma=c.constants||{},c.easing)for(var d in c.easing)W[d]=c.easing[d];ta=c.edgeStrategy||"set",ka={beforerender:c.beforerender,render:c.render,keyframe:c.keyframe},la=c.forceHeight!==!1,la&&(Ka=c.scale||1),na=c.mobileDeceleration||y,pa=c.smoothScrolling!==!1,qa=c.smoothScrollingDuration||A,ra={targetTop:ha.getScrollTop()},Sa=(c.mobileCheck||function(){return/Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent||navigator.vendor||a.opera)})(),Sa?(ja=b.getElementById(c.skrollrBody||z),ja&&ga(),X(),Ea(e,[s,v],[t])):Ea(e,[s,u],[t]),ha.refresh(),wa(a,"resize orientationchange",function(){var a=e.clientWidth,b=e.clientHeight;(b!==Pa||a!==Oa)&&(Pa=b,Oa=a,Qa=!0)});var g=U();return function h(){$(),va=g(h)}(),ha}var e,f,g={get:function(){return ha},init:function(a){return ha||new d(a)},VERSION:"0.6.30"},h=Object.prototype.hasOwnProperty,i=a.Math,j=a.getComputedStyle,k="touchstart",l="touchmove",m="touchcancel",n="touchend",o="skrollable",p=o+"-before",q=o+"-between",r=o+"-after",s="skrollr",t="no-"+s,u=s+"-desktop",v=s+"-mobile",w="linear",x=1e3,y=.004,z="skrollr-body",A=200,B="start",C="end",D="center",E="bottom",F="___skrollable_id",G=/^(?:input|textarea|button|select)$/i,H=/^\s+|\s+$/g,I=/^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/,J=/\s*(@?[\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi,K=/^(@?[a-z\-]+)\[(\w+)\]$/,L=/-([a-z0-9_])/g,M=function(a,b){return b.toUpperCase()},N=/[\-+]?[\d]*\.?[\d]+/g,O=/\{\?\}/g,P=/rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g,Q=/[a-z\-]+-gradient/g,R="",S="",T=function(){var a=/^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;if(j){var b=j(f,null);for(var c in b)if(R=c.match(a)||+c==c&&b[c].match(a))break;if(!R)return void(R=S="");R=R[0],"-"===R.slice(0,1)?(S=R,R={"-webkit-":"webkit","-moz-":"Moz","-ms-":"ms","-o-":"O"}[R]):S="-"+R.toLowerCase()+"-"}},U=function(){var b=a.requestAnimationFrame||a[R.toLowerCase()+"RequestAnimationFrame"],c=Ha();return(Sa||!b)&&(b=function(b){var d=Ha()-c,e=i.max(0,1e3/60-d);return a.setTimeout(function(){c=Ha(),b()},e)}),b},V=function(){var b=a.cancelAnimationFrame||a[R.toLowerCase()+"CancelAnimationFrame"];return(Sa||!b)&&(b=function(b){return a.clearTimeout(b)}),b},W={begin:function(){return 0},end:function(){return 1},linear:function(a){return a},quadratic:function(a){return a*a},cubic:function(a){return a*a*a},swing:function(a){return-i.cos(a*i.PI)/2+.5},sqrt:function(a){return i.sqrt(a)},outCubic:function(a){return i.pow(a-1,3)+1},bounce:function(a){var b;if(.5083>=a)b=3;else if(.8489>=a)b=9;else if(.96208>=a)b=27;else{if(!(.99981>=a))return 1;b=91}return 1-i.abs(3*i.cos(a*b*1.028)/b)}};d.prototype.refresh=function(a){var d,e,f=!1;for(a===c?(f=!0,ia=[],Ra=0,a=b.getElementsByTagName("*")):a.length===c&&(a=[a]),d=0,e=a.length;e>d;d++){var g=a[d],h=g,i=[],j=pa,k=ta,l=!1;if(f&&F in g&&delete g[F],g.attributes){for(var m=0,n=g.attributes.length;n>m;m++){var p=g.attributes[m];if("data-anchor-target"!==p.name)if("data-smooth-scrolling"!==p.name)if("data-edge-strategy"!==p.name)if("data-emit-events"!==p.name){var q=p.name.match(I);if(null!==q){var r={props:p.value,element:g,eventType:p.name.replace(L,M)};i.push(r);var s=q[1];s&&(r.constant=s.substr(1));var t=q[2];/p$/.test(t)?(r.isPercentage=!0,r.offset=(0|t.slice(0,-1))/100):r.offset=0|t;var u=q[3],v=q[4]||u;u&&u!==B&&u!==C?(r.mode="relative",r.anchors=[u,v]):(r.mode="absolute",u===C?r.isEnd=!0:r.isPercentage||(r.offset=r.offset*Ka))}}else l=!0;else k=p.value;else j="off"!==p.value;else if(h=b.querySelector(p.value),null===h)throw'Unable to find anchor target "'+p.value+'"'}if(i.length){var w,x,y;!f&&F in g?(y=g[F],w=ia[y].styleAttr,x=ia[y].classAttr):(y=g[F]=Ra++,w=g.style.cssText,x=Da(g)),ia[y]={element:g,styleAttr:w,classAttr:x,anchorTarget:h,keyFrames:i,smoothScrolling:j,edgeStrategy:k,emitEvents:l,lastFrameIndex:-1},Ea(g,[o],[])}}}for(Aa(),d=0,e=a.length;e>d;d++){var z=ia[a[d][F]];z!==c&&(_(z),ba(z))}return ha},d.prototype.relativeToAbsolute=function(a,b,c){var d=e.clientHeight,f=a.getBoundingClientRect(),g=f.top,h=f.bottom-f.top;return b===E?g-=d:b===D&&(g-=d/2),c===E?g+=h:c===D&&(g+=h/2),g+=ha.getScrollTop(),g+.5|0},d.prototype.animateTo=function(a,b){b=b||{};var d=Ha(),e=ha.getScrollTop(),f=b.duration===c?x:b.duration;return oa={startTop:e,topDiff:a-e,targetTop:a,duration:f,startTime:d,endTime:d+f,easing:W[b.easing||w],done:b.done},oa.topDiff||(oa.done&&oa.done.call(ha,!1),oa=c),ha},d.prototype.stopAnimateTo=function(){oa&&oa.done&&oa.done.call(ha,!0),oa=c},d.prototype.isAnimatingTo=function(){return!!oa},d.prototype.isMobile=function(){return Sa},d.prototype.setScrollTop=function(b,c){return sa=c===!0,Sa?Ta=i.min(i.max(b,0),Ja):a.scrollTo(0,b),ha},d.prototype.getScrollTop=function(){return Sa?Ta:a.pageYOffset||e.scrollTop||f.scrollTop||0},d.prototype.getMaxScrollTop=function(){return Ja},d.prototype.on=function(a,b){return ka[a]=b,ha},d.prototype.off=function(a){return delete ka[a],ha},d.prototype.destroy=function(){var a=V();a(va),ya(),Ea(e,[t],[s,u,v]);for(var b=0,d=ia.length;d>b;b++)fa(ia[b].element);e.style.overflow=f.style.overflow="",e.style.height=f.style.height="",ja&&g.setStyle(ja,"transform","none"),ha=c,ja=c,ka=c,la=c,Ja=0,Ka=1,ma=c,na=c,La="down",Ma=-1,Oa=0,Pa=0,Qa=!1,oa=c,pa=c,qa=c,ra=c,sa=c,Ra=0,ta=c,Sa=!1,Ta=0,ua=c};var X=function(){var d,g,h,j,o,p,q,r,s,t,u,v;wa(e,[k,l,m,n].join(" "),function(a){var e=a.changedTouches[0];for(j=a.target;3===j.nodeType;)j=j.parentNode;switch(o=e.clientY,p=e.clientX,t=a.timeStamp,G.test(j.tagName)||a.preventDefault(),a.type){case k:d&&d.blur(),ha.stopAnimateTo(),d=j,g=q=o,h=p,s=t;break;case l:G.test(j.tagName)&&b.activeElement!==j&&a.preventDefault(),r=o-q,v=t-u,ha.setScrollTop(Ta-r,!0),q=o,u=t;break;default:case m:case n:var f=g-o,w=h-p,x=w*w+f*f;if(49>x){if(!G.test(d.tagName)){d.focus();var y=b.createEvent("MouseEvents");y.initMouseEvent("click",!0,!0,a.view,1,e.screenX,e.screenY,e.clientX,e.clientY,a.ctrlKey,a.altKey,a.shiftKey,a.metaKey,0,null),d.dispatchEvent(y)}return}d=c;var z=r/v;z=i.max(i.min(z,3),-3);var A=i.abs(z/na),B=z*A+.5*na*A*A,C=ha.getScrollTop()-B,D=0;C>Ja?(D=(Ja-C)/B,C=Ja):0>C&&(D=-C/B,C=0),A*=1-D,ha.animateTo(C+.5|0,{easing:"outCubic",duration:A})}}),a.scrollTo(0,0),e.style.overflow=f.style.overflow="hidden"},Y=function(){var a,b,c,d,f,g,h,j,k,l,m,n=e.clientHeight,o=Ba();for(j=0,k=ia.length;k>j;j++)for(a=ia[j],b=a.element,c=a.anchorTarget,d=a.keyFrames,f=0,g=d.length;g>f;f++)h=d[f],l=h.offset,m=o[h.constant]||0,h.frame=l,h.isPercentage&&(l*=n,h.frame=l),"relative"===h.mode&&(fa(b),h.frame=ha.relativeToAbsolute(c,h.anchors[0],h.anchors[1])-l,fa(b,!0)),h.frame+=m,la&&!h.isEnd&&h.frame>Ja&&(Ja=h.frame);for(Ja=i.max(Ja,Ca()),j=0,k=ia.length;k>j;j++){for(a=ia[j],d=a.keyFrames,f=0,g=d.length;g>f;f++)h=d[f],m=o[h.constant]||0,h.isEnd&&(h.frame=Ja-h.offset+m);a.keyFrames.sort(Ia)}},Z=function(a,b){for(var c=0,d=ia.length;d>c;c++){var e,f,i=ia[c],j=i.element,k=i.smoothScrolling?a:b,l=i.keyFrames,m=l.length,n=l[0],s=l[l.length-1],t=k<n.frame,u=k>s.frame,v=t?n:s,w=i.emitEvents,x=i.lastFrameIndex;if(t||u){if(t&&-1===i.edge||u&&1===i.edge)continue;switch(t?(Ea(j,[p],[r,q]),w&&x>-1&&(za(j,n.eventType,La),i.lastFrameIndex=-1)):(Ea(j,[r],[p,q]),w&&m>x&&(za(j,s.eventType,La),i.lastFrameIndex=m)),i.edge=t?-1:1,i.edgeStrategy){case"reset":fa(j);continue;case"ease":k=v.frame;break;default:case"set":var y=v.props;for(e in y)h.call(y,e)&&(f=ea(y[e].value),0===e.indexOf("@")?j.setAttribute(e.substr(1),f):g.setStyle(j,e,f));continue}}else 0!==i.edge&&(Ea(j,[o,q],[p,r]),i.edge=0);for(var z=0;m-1>z;z++)if(k>=l[z].frame&&k<=l[z+1].frame){var A=l[z],B=l[z+1];for(e in A.props)if(h.call(A.props,e)){var C=(k-A.frame)/(B.frame-A.frame);C=A.props[e].easing(C),f=da(A.props[e].value,B.props[e].value,C),f=ea(f),0===e.indexOf("@")?j.setAttribute(e.substr(1),f):g.setStyle(j,e,f)}w&&x!==z&&("down"===La?za(j,A.eventType,La):za(j,B.eventType,La),i.lastFrameIndex=z);break}}},$=function(){Qa&&(Qa=!1,Aa());var a,b,d=ha.getScrollTop(),e=Ha();if(oa)e>=oa.endTime?(d=oa.targetTop,a=oa.done,oa=c):(b=oa.easing((e-oa.startTime)/oa.duration),d=oa.startTop+b*oa.topDiff|0),ha.setScrollTop(d,!0);else if(!sa){var f=ra.targetTop-d;f&&(ra={startTop:Ma,topDiff:d-Ma,targetTop:d,startTime:Na,endTime:Na+qa}),e<=ra.endTime&&(b=W.sqrt((e-ra.startTime)/qa),d=ra.startTop+b*ra.topDiff|0)}if(sa||Ma!==d){La=d>Ma?"down":Ma>d?"up":La,sa=!1;var h={curTop:d,lastTop:Ma,maxTop:Ja,direction:La},i=ka.beforerender&&ka.beforerender.call(ha,h);i!==!1&&(Z(d,ha.getScrollTop()),Sa&&ja&&g.setStyle(ja,"transform","translate(0, "+-Ta+"px) "+ua),Ma=d,ka.render&&ka.render.call(ha,h)),a&&a.call(ha,!1)}Na=e},_=function(a){for(var b=0,c=a.keyFrames.length;c>b;b++){for(var d,e,f,g,h=a.keyFrames[b],i={};null!==(g=J.exec(h.props));)f=g[1],e=g[2],d=f.match(K),null!==d?(f=d[1],d=d[2]):d=w,e=e.indexOf("!")?aa(e):[e.slice(1)],i[f]={value:e,easing:W[d]};h.props=i}},aa=function(a){var b=[];return P.lastIndex=0,a=a.replace(P,function(a){return a.replace(N,function(a){return a/255*100+"%"})}),S&&(Q.lastIndex=0,a=a.replace(Q,function(a){return S+a})),a=a.replace(N,function(a){return b.push(+a),"{?}"}),b.unshift(a),b},ba=function(a){var b,c,d={};for(b=0,c=a.keyFrames.length;c>b;b++)ca(a.keyFrames[b],d);for(d={},b=a.keyFrames.length-1;b>=0;b--)ca(a.keyFrames[b],d)},ca=function(a,b){var c;for(c in b)h.call(a.props,c)||(a.props[c]=b[c]);for(c in a.props)b[c]=a.props[c]},da=function(a,b,c){var d,e=a.length;if(e!==b.length)throw"Can't interpolate between \""+a[0]+'" and "'+b[0]+'"';var f=[a[0]];for(d=1;e>d;d++)f[d]=a[d]+(b[d]-a[d])*c;return f},ea=function(a){var b=1;return O.lastIndex=0,a[0].replace(O,function(){return a[b++]})},fa=function(a,b){a=[].concat(a);for(var c,d,e=0,f=a.length;f>e;e++)d=a[e],c=ia[d[F]],c&&(b?(d.style.cssText=c.dirtyStyleAttr,Ea(d,c.dirtyClassAttr)):(c.dirtyStyleAttr=d.style.cssText,c.dirtyClassAttr=Da(d),d.style.cssText=c.styleAttr,Ea(d,c.classAttr)))},ga=function(){ua="translateZ(0)",g.setStyle(ja,"transform",ua);var a=j(ja),b=a.getPropertyValue("transform"),c=a.getPropertyValue(S+"transform"),d=b&&"none"!==b||c&&"none"!==c;d||(ua="")};g.setStyle=function(a,b,c){var d=a.style;if(b=b.replace(L,M).replace("-",""),"zIndex"===b)isNaN(c)?d[b]=c:d[b]=""+(0|c);else if("float"===b)d.styleFloat=d.cssFloat=c;else try{R&&(d[R+b.slice(0,1).toUpperCase()+b.slice(1)]=c),d[b]=c}catch(e){}};var ha,ia,ja,ka,la,ma,na,oa,pa,qa,ra,sa,ta,ua,va,wa=g.addEvent=function(b,c,d){var e=function(b){return b=b||a.event,b.target||(b.target=b.srcElement),b.preventDefault||(b.preventDefault=function(){b.returnValue=!1,b.defaultPrevented=!0}),d.call(this,b)};c=c.split(" ");for(var f,g=0,h=c.length;h>g;g++)f=c[g],b.addEventListener?b.addEventListener(f,d,!1):b.attachEvent("on"+f,e),Ua.push({element:b,name:f,listener:d})},xa=g.removeEvent=function(a,b,c){b=b.split(" ");for(var d=0,e=b.length;e>d;d++)a.removeEventListener?a.removeEventListener(b[d],c,!1):a.detachEvent("on"+b[d],c)},ya=function(){for(var a,b=0,c=Ua.length;c>b;b++)a=Ua[b],xa(a.element,a.name,a.listener);Ua=[]},za=function(a,b,c){ka.keyframe&&ka.keyframe.call(ha,a,b,c)},Aa=function(){var a=ha.getScrollTop();Ja=0,la&&!Sa&&(f.style.height=""),Y(),la&&!Sa&&(f.style.height=Ja+e.clientHeight+"px"),Sa?ha.setScrollTop(i.min(ha.getScrollTop(),Ja)):ha.setScrollTop(a,!0),sa=!0},Ba=function(){var a,b,c=e.clientHeight,d={};for(a in ma)b=ma[a],"function"==typeof b?b=b.call(ha):/p$/.test(b)&&(b=b.slice(0,-1)/100*c),d[a]=b;return d},Ca=function(){var a,b=0;return ja&&(b=i.max(ja.offsetHeight,ja.scrollHeight)),a=i.max(b,f.scrollHeight,f.offsetHeight,e.scrollHeight,e.offsetHeight,e.clientHeight),a-e.clientHeight},Da=function(b){var c="className";return a.SVGElement&&b instanceof a.SVGElement&&(b=b[c],c="baseVal"),b[c]},Ea=function(b,d,e){var f="className";if(a.SVGElement&&b instanceof a.SVGElement&&(b=b[f],f="baseVal"),e===c)return void(b[f]=d);for(var g=b[f],h=0,i=e.length;i>h;h++)g=Ga(g).replace(Ga(e[h])," ");g=Fa(g);for(var j=0,k=d.length;k>j;j++)-1===Ga(g).indexOf(Ga(d[j]))&&(g+=" "+d[j]);b[f]=Fa(g)},Fa=function(a){return a.replace(H,"")},Ga=function(a){return" "+a+" "},Ha=Date.now||function(){return+new Date},Ia=function(a,b){return a.frame-b.frame},Ja=0,Ka=1,La="down",Ma=-1,Na=Ha(),Oa=0,Pa=0,Qa=!1,Ra=0,Sa=!1,Ta=0,Ua=[];"function"==typeof define&&define.amd?define([],function(){return g}):"undefined"!=typeof module&&module.exports?module.exports=g:a.skrollr=g}(window,document);;
(function ($) {
   $.fn.gav_skrollr = function(s) {
      var $w = $(window), 
          loaded, 
          skrollr = this
          th = 200;
       this.one("gav_skrollr", function() {
         s.refresh();
      });
      function gav_skrollr() {
         var inview = skrollr.filter(function() {
           var $e = $(this);
           var wt = $w.scrollTop(),
               wb = wt + $w.height(),
               et = $e.offset().top,
               eb = et + $e.height();

           return eb >= wt - th && et <= wb + th;
         });
         loaded = inview.trigger("gav_skrollr");
         skrollr = skrollr.not(loaded);
      }
      $(window).on("scroll.gav_skrollr", gav_skrollr);
   };
   $(window).on('load', function(){
      setTimeout(function() {
         s = skrollr.init({forceHeight:!1,smoothScrolling:!1,mobileCheck:function(){return!1}});
         if($('.skrollable.refresh').length){
            $('.skrollable.refresh').gav_skrollr(s);
         }
      }, 50);
   });
})(jQuery);
;
