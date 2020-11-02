
const socket = io('/');
const videoGrid=document.getElementById('video-grid');
const myVideo=document.createElement('video');
myVideo.muted=true;

var peer= new Peer(undefined, {
    path:'/peerjs',
    host:'/',
    port:'443'
});

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true

}).then(stream =>
    {
    myVideoStream=stream;
    addVideoStream(myVideo,stream);
    
    
    peer.on('call', call => {
 
    call.answer(stream)
    const video= document.createElement('video')
    call.on('stream',userVideoStream => {
        addVideoStream(video,userVideoStream)
    })
})


    socket.on('user-connected',(userId) => {
        console.log("user connected.,..........");
      setTimeout(function ()
        {
          connectToNewUser(userId, stream);
        },5000
      )
    })
    
})
peer.on('open', id =>{
    socket.emit('join-room',ROOM_ID,id);

})


const connectToNewUser=(userId,stream) => {
    const call=peer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream => {
        
        addVideoStream(video,userVideoStream)
    })
}

const addVideoStream = (video,stream) =>{
    video.srcObject=stream;

    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

let text1=$('input')


$('html').keydown((e) => {
    if(e.which==13 && text1.val().length!==0){
        console.log(text1)
        socket.emit('message',text1.val());
        text1.val('')
    }
});

socket.on('createMessage',message => {
    $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`)
    scrollToBottom()
})

const scrollToBottom = () => {
    var d=$('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute= () => {
    const enabled=myVideoStream.getAudioTracks()[0].enabled;
    
    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton()
    }
    else{
        setMuteButton()
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}

const setMuteButton = () => {
    const html = `<i class="fas fa-microphone"</i>
    <span>Mute</span>`

    document.querySelector('.main__mute_button').innerHTML=html;
}

const setUnmuteButton= () => {
    const html = `<i class="unmute fas fa-microphone-slash"</i>
    <span>Unmute</span>`

    document.querySelector('.main__mute_button').innerHTML=html;

}



const playStop= () => {
    let enabled=myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled=false;
        setPlayVideo()
    }
    else
    {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled=true;
    }
}
const setStopVideo= () => {
    const html= `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>`

    document.querySelector('.main__video_button').innerHTML=html;

}
const setPlayVideo= () => {
    const html= `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>`

    document.querySelector('.main__video_button').innerHTML=html;
    
}
var speechRecognition = window.webkitSpeechRecognition

var recognition=new speechRecognition()
var textbox = $("#textbox")
var content= ''

recognition.continuous=true

recognition.onStart = function () {
    console.log("Started recording")
}
recognition.onspeechend= function () {
    console.log("try again")
}
recognition.onerror = function () {
    console.log("try again")
}
recognition.onresult = function(event){
    var current = event.resultIndex;

    var transcript = event.results[current][0].transcript
    
    content += transcript

    textbox.val(content)

    
}

$("#start-recording").click(function(event){
    console.log("here")
    if(content.length)
    {
        content+= ''
    }
    recognition.start();
})
$("#stop-recording").click(function(event){
    
    recognition.stop();
})