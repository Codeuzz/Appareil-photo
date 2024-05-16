const resultDiv = document.getElementById("result-div");
const photos = document.getElementById("photos");
const validerBtn = document.getElementById("valider-btn");
const photoBtn = document.getElementById("photo-btn");
// const saveBtn = document.getElementById("save-btn");
const periphSelect = document.getElementById("periph-select");


let activeStream = null;




function displayVideo(deviceId) {
    while (resultDiv.firstChild) {
        resultDiv.removeChild(resultDiv.firstChild);
    }
    if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
        activeStream = null;
    }


    navigator.mediaDevices.getUserMedia({video: {deviceId: {exact: deviceId}}})
    .then((media) => {
       const video = document.createElement('video');
        video.srcObject = media;
        video.autoplay = true;
        video.width = 320;
        video.height = 240;
        resultDiv.appendChild(video);
        activeStream = media;
        photoBtn.style.display = 'block';


    })
    .catch(err => console.log(err, 'caca'))
}
 

function getPeriph() {
    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        devices.forEach(device => {
            if(device.kind === 'videoinput') {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `Camera ${periphSelect.options.length + 1}`;
                periphSelect.appendChild(option)
            }
        })
    })
    .catch(err => console.log(err))
}


function screenVid() {
    const video = document.querySelector('video');
    video.width = 320;
    video.height = 240;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
console.log(video.width)
    canvas.width = video.width;
    canvas.height = video.height;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');
   
    const photoDiv = document.createElement('div');
    photoDiv.classList.add('photo');

    const img = document.createElement('img');
    img.src = dataURL;

    const saveBtn = document.createElement('a');
    saveBtn.textContent = 'Sauvegarder';
    saveBtn.classList.add('save-button');
    saveBtn.download = 'screenshot.png';
    saveBtn.href = dataURL;

    photoDiv.appendChild(saveBtn);
    photoDiv.appendChild(img);
    photos.appendChild(photoDiv);
    

}

getPeriph()


validerBtn.addEventListener("click", () => {
    const selectedDeviceId = periphSelect.value;
    if (selectedDeviceId) {
        displayVideo(selectedDeviceId);
    } else {
        alert('Aucun périphérique sélectionné')
    }
})

photoBtn.addEventListener("click", () => {
    screenVid()
});