
var spawn = require('child_process').spawn;
var Iconv = require('iconv').Iconv;

var url = 'http://www.bobaedream.co.kr/center/center.htm';
var curl = spawn('curl', [url]);

var body = '';
var str_err = null;

curl.stdout.setEncoding('binary'); // euc-kr 문서는 binary 로 출력해야됨
curl.stdout.on('data', function(chunk){
 body += chunk;
});

curl.stderr.on('data', function(err) { 
 if (str_err === null) { str_err = ''; }
 str_err += err;
});

curl.on('close', function(code){
 
 if (code != 0) { 
  console.log('Failed: ' + code);
  console.log(err);
 }else{

   var escape_text = escape(body);

   var toUTF8 = new Iconv('euckr', 'utf8//TRANSLIT//IGNORE');

   var toHex = function(n) {
   return parseInt('0x' + n);
  };

   var str = escape_text.replace(/(%([^%]{2}))+/gim, function(chars) {
   var b;
   
   b = new Buffer(chars.split('%').slice(1).map(toHex));

    var utf8_str = toUTF8.convert(b).toString();

    return utf8_str;
  });

   console.log(str); // 한글이 잘 나옴..
 }

});
