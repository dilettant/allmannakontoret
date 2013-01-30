function readability() {
  window.baseUrl = 'http://www.readability.com';
  window.readabilityToken = 'cP4kvYr7BKyGUFuEtLDWhP4hBpeW9GdtcbTV4bGf';
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('charset', 'UTF-8');
  s.setAttribute('src', baseUrl + '/bookmarklet/read.js');
  document.documentElement.appendChild(s);
};

function validateEmail($email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  if( !emailReg.test( $email ) ) {
    return false;
  } else {
    return true;
  }
};

$(document).ready(function(){
    //parse links, user id's, hashtags
    function linkify(d){
      return d.replace(/\bhttps?\:\/\/\S+/gi, function(b){
        var c='';
        b= b.replace(/(\.*|\?*|\!*)$/,function(m,a){
          c=a;
          return ''
        });
        return '<a class="rrt-link" href="'+b+'">'+((b.length>25)?b.substr(0,24)+'...':b)+'</a>'+c;
      })
      .replace(/\B\@([A-Z0-9_]{1,15})/gi,'@<a href="http://twitter.com/$1">$1</a>')
      .replace(/\B\#([A-Z0-9_]+)/gi,'<a href="http://search.twitter.com/search?q=%23$1">#$1</a>')
    };

    var user = '_dilettant';
    var hashtag = 'thepublicoffice';
    var months = new Array("Jan", "Feb", "Mar", 
"Apr", "May", "Jun", "Jul", "Aug", "Sep", 
"Oct", "Nov", "Dec");

    $.ajax({
      url: "http://search.twitter.com/search.json",
      dataType: 'jsonp',
      data: {"q": "%23" + hashtag, "from" : "@" + user, "result_type":"mixed"},
      success: function(data){
        var lastTweet = data.results[0];
        if(lastTweet) {
          var dateString = lastTweet['created_at'];
          var date = new Date(dateString);
          var text = lastTweet['text'];
          var url = 'https://twitter.com/' + user + '/status/' + lastTweet['id_str'];
          var hour = date.getHours();
          var minutes = date.getMinutes();
          var day = date.getDate();
          var month = date.getMonth();
          var tweetDate =  hour + ':' + minutes + '<br>' + day + ' ' + months[month];

          $('.twitter.content').html(linkify(text));
          $('.twitter.date').html(tweetDate);
          $('.twitter h1 a').attr({'href':url});
        }
      }
    });
    
  // Readability
  var readab = document.getElementById('read');
  readab.onclick = function(){
    readability();
    return false;
  };
  $('.nlbutton').addClass('disabled').attr('disabled', 'disabled');

  $('.lbqod').keyup(function (e) { 
    var val = $(this).val();
    if(validateEmail(val)) {
      $('.nlbutton').removeClass('disabled').attr('disabled', null);
    } else {
      $('.nlbutton').addClass('disabled').attr('disabled', 'disabled');
    }
  });

  // Sticky menu
  // -----------

  var oritop = -100;
  var elm = $(".submenu"); //get the box we want to make sticky
  var foot = $("footer");
  var footerTop = foot.offset().top;

  $(window).scroll(function() { //on scroll,
    var scrollt = window.scrollY; //get the amount of scrolling
    if(elm.length > 0 && oritop < 0) {
      oritop= elm.offset().top; //cache the original top offset
      oritheig = elm.height();
    }

    if(scrollt >= oritop) { //if you scrolled past it,
      if((scrollt + oritheig) >= footerTop) {
        // console.log('one');
        // touches footer
        //make it sticky
        elm.css({"position": "absolute", "top": footerTop - oritheig - 20, 'width': '220px'});
      } else {
      // console.log('two');
      // doesnt touch footer
        elm.css({"position": "fixed", "top": 0, 'width': '220px'}); //make it sticky
      }
    }
    else { //otherwise
      // console.log('three');
      elm.css("position", "static"); //reset it to default positioning
    }
  });
  
  // onload reposition menu if it overlaps
  // if(window.scrollY + elm.height() >= footerTop ) {
  //   elm.css({"position": "absolute", "top": footerTop - oritheig - 20, 'width': '220px'});
  // }

  // Inner links activating
  // ----------------------

  var $priLisA = $('.primary li a');
  var $secLis = $('.secondary li');
  var $seclisA = $secLis.find('a');
  var clss="active";
  var hash = window.location.hash;

  $priLisA.click(function() {
    $secLis.removeClass(clss);
    $seclisA.removeClass(clss);
  });

  $seclisA.click(function() {
    $secLis.removeClass(clss);
    $seclisA.removeClass(clss);
    $(this).addClass(clss);
    $(this).parent().parent().addClass(clss); // parent li
    if(hash) {
      event.preventDefault();
      var thisHash = this.hash;
      $('html,body').animate({scrollTop:$(thisHash).offset().top}, 500);
      document.location.hash=thisHash;
    }
  });

  if(hash) {
    var $li = $('.secondary li[rel="' + hash.replace('#', '') + '"] ');
    $li.addClass(clss);
    $li.find('a').addClass(clss);
  }

});