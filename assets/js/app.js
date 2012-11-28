function readability() {
  window.baseUrl = 'http://www.readability.com';
  window.readabilityToken = 'cP4kvYr7BKyGUFuEtLDWhP4hBpeW9GdtcbTV4bGf';
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('charset', 'UTF-8');
  s.setAttribute('src', baseUrl + '/bookmarklet/read.js');
  document.documentElement.appendChild(s);
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
    });
    
  // Readability
  var readab = document.getElementById('read');
  readab.onclick = function(){
    readability();
    return false;
  };

  // cookies and newsletter
  var cookies = document.cookie.replace('; ', ';').split(";"),
      len = cookies.length,
      thepublicoffice,
      thepublicofficeEmail,
      i;
  for (i = 0; i < len; i++) {
    // console.log('cookies[i]', cookies[i]);
    // console.log('indexOf', cookies[i].indexOf("thepublicoffice="));
    var matchme = "thepublicoffice=";
    var matched = cookies[i].indexOf(matchme);
    console.log('matchme', matchme);
    console.log('matched', matched);
    console.log('matched + matchme.length', matched + matchme.length);
    console.log('matched + matchme.length', matched + matchme.length);
    console.log('-20,2', cookies[i].substr(-20,matchme.length));
    thepublicoffice = cookies[i].substr(matched, matched + matchme.length);
    thepublicofficeEmail = cookies[i].substr(0,cookies[i].indexOf("thepublicoffice-email="));
  };
  console.log('thepublicoffice', thepublicoffice);
  console.log('thepublicofficeEmail', thepublicofficeEmail);
});