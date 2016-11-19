var res = id('result');

id('test_btn').onclick = function(){
  id('prgs').style.display = "block"
  res.innerHTML = 'Checking TURN Server...';
  prgs();
  var url = 'turn:'+id('url').value+':'+id('port').value,
  useUDP = id('udp').checked;
  url +='?transport=' + (useUDP ? 'udp': 'tcp');
  checkTURNServer({
    urls: url,
    username: id('username').value,
    credential: id('password').value
  },5000).then(function(bool){
    if(bool)
    res.innerHTML = 'Yep, the TURN server works...';
    else
    throw new Error('Doesn\'t work');
  }).catch(function(e){
    console.log(e);
    res.innerHTML = 'TURN server does not work.';
  });
};

var prgstimer
function prgs() {
    clearInterval(prgstimer);
    var elem = document.getElementById("prgsbar");
    var width = 1;
    prgstimer = setInterval(frame, 10);
    function frame() {
        if (width >= 100) {
            clearInterval(prgstimer);
        } else {
            width += 0.2;
            elem.style.width = width + '%';
        }
    }
}

function checkTURNServer(turnConfig, timeout){
  console.log('turnConfig: ', turnConfig);
  return new Promise(function(resolve, reject){

    setTimeout(function(){
      if(promiseResolved) return;
      resolve(false);
      promiseResolved = true;
    }, timeout || 5000);

    var promiseResolved = false
    , myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
    , pc = new myPeerConnection({iceServers:[turnConfig]})
    , noop = function(){};
    pc.createDataChannel("");
    pc.createOffer(function(sdp){
      if(sdp.sdp.indexOf('typ relay') > -1){
        promiseResolved = true;
        resolve(true);
      }
      pc.setLocalDescription(sdp, noop, noop);
    }, noop);
    pc.onicecandidate = function(ice){
      if(promiseResolved || !ice || !ice.candidate || !ice.candidate.candidate || !(ice.candidate.candidate.indexOf('typ relay')>-1))  return;
      promiseResolved = true;
      resolve(true);
    };
  });
}


function id(val){
  return document.getElementById(val);
}
