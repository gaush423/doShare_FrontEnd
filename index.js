const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector("#browseBtn");

const bgProgress = document.querySelector(".bg-progress");
const progressPercent = document.querySelector("#progressPercent");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.querySelector(".progress-bar");
const status = document.querySelector(".status");

const sharingContainer = document.querySelector(".sharing-container");
const copyURLBtn = document.querySelector("#copyURLBtn");
const fileURL = document.querySelector("#fileURL");
const emailForm = document.querySelector("#emailForm");

const toast = document.querySelector(".toast");

const baseURL = "http://localhost:3000";
const uploadURL = `${baseURL}/api/files`;
const emailURL = `${baseURL}/api/files/send`;

const maxAllowedSize = 100 * 1024 * 1024; //100mb


browseBtn.addEventListener("click", () => {
  fileInput.click();
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  //   console.log("dropped", e.dataTransfer.files[0].name);
  const files = e.dataTransfer.files;
  if (files.length === 1) {
    if (files[0].size < maxAllowedSize) {
      fileInput.files = files;
      uploadFile();
    } else {
      showToast("Max file size is 100MB");
    }
  } else if (files.length > 1) {
    showToast("You can't upload multiple files");
  }
  dropZone.classList.remove("dragged");
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragged");

  // console.log("dropping file");
});

dropZone.addEventListener("dragleave", (e) => {
  dropZone.classList.remove("dragged");

  console.log("drag ended");
});

// file input change and uploader
fileInput.addEventListener("change", () => {
  if (fileInput.files[0].size > maxAllowedSize) {
    showToast("Max file size is 100MB");
    fileInput.value = ""; // reset the input
    return;
  }
  uploadFile();
});

// sharing container listenrs
copyURLBtn.addEventListener("click", () => {
  fileURL.select();
  document.execCommand("copy");
  showToast("Copied to clipboard");
});

fileURL.addEventListener("click", () => {
  fileURL.select();
});

const uploadFile = () => {
  console.log("file added uploading");

  files = fileInput.files;
  const formData = new FormData();
  formData.append("myfile", files[0]);

  //show the uploader
  progressContainer.style.display = "block";

  // upload file
  const xhr = new XMLHttpRequest();

  // listen for upload progress
  xhr.upload.onprogress = function (event) {
    // find the percentage of uploaded
    let percent = Math.round((100 * event.loaded) / event.total);
    progressPercent.innerText = percent;
    const scaleX = `scaleX(${percent / 100})`;
    bgProgress.style.transform = scaleX;
    progressBar.style.transform = scaleX;
  };

  // handle error
  xhr.upload.onerror = function () {
    showToast(`Error in upload: ${xhr.status}.`);
    fileInput.value = ""; // reset the input
  };

  // listen for response which will give the link
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      onFileUploadSuccess(xhr.responseText);
    }
  };

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

const onFileUploadSuccess = (res) => {
  fileInput.value = ""; // reset the input
  status.innerText = "Uploaded";

  // remove the disabled attribute from form btn & make text send
  emailForm[2].removeAttribute("disabled");
  emailForm[2].innerText = "Send";
  progressContainer.style.display = "none"; // hide the box

  const { file: url } = JSON.parse(res);
  console.log(url);
  sharingContainer.style.display = "block";
  fileURL.value = url;
};

emailForm.addEventListener("submit", (e) => {
  e.preventDefault(); // stop submission

  // disable the button
  emailForm[2].setAttribute("disabled", "true");
  emailForm[2].innerText = "Sending";

  const url = fileURL.value;

  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  };
  console.log(formData);
  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        showToast("Email Sent");
        sharingContainer.style.display = "none"; // hide the box
      }
    });
});

let toastTimer;
// the toast function
const showToast = (msg) => {
  clearTimeout(toastTimer);
  toast.innerText = msg;
  toast.classList.add("show");
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
};

// Low-poly Background animations

var refreshDuration = 10000;
        var refreshTimeout;
        var numPointsX;
        var numPointsY;
        var unitWidth;
        var unitHeight;
        var points;
        
        function onLoad()
        {
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width',window.outerWidth);
            svg.setAttribute('height',window.outerHeight);
            document.querySelector('#bg').appendChild(svg);
        
            var unitSize = (window.innerWidth+window.innerHeight)/15;
            numPointsX = Math.ceil(window.innerWidth/unitSize)+1;
            numPointsY = Math.ceil(window.innerHeight/unitSize)+1;
            unitWidth = Math.ceil(window.innerWidth/(numPointsX-1));
            unitHeight = Math.ceil(window.innerHeight/(numPointsY-1));
        
            points = [];
        
            for(var y = 0; y < numPointsY; y++) {
                for(var x = 0; x < numPointsX; x++) {
                    points.push({x:unitWidth*x, y:unitHeight*y, originX:unitWidth*x, originY:unitHeight*y});
                }
            }
        
            randomize();
        
            for(var i = 0; i < points.length; i++) {
                if(points[i].originX != unitWidth*(numPointsX-1) && points[i].originY != unitHeight*(numPointsY-1)) {
                    var topLeftX = points[i].x;
                    var topLeftY = points[i].y;
                    var topRightX = points[i+1].x;
                    var topRightY = points[i+1].y;
                    var bottomLeftX = points[i+numPointsX].x;
                    var bottomLeftY = points[i+numPointsX].y;
                    var bottomRightX = points[i+numPointsX+1].x;
                    var bottomRightY = points[i+numPointsX+1].y;
        
                    var rando = Math.floor(Math.random()*2);
        
                    for(var n = 0; n < 2; n++) {
                        var polygon = document.createElementNS(svg.namespaceURI, 'polygon');
        
                        if(rando==0) {
                            if(n==0) {
                                polygon.point1 = i;
                                polygon.point2 = i+numPointsX;
                                polygon.point3 = i+numPointsX+1;
                                polygon.setAttribute('points',topLeftX+','+topLeftY+' '+bottomLeftX+','+bottomLeftY+' '+bottomRightX+','+bottomRightY);
                            } else if(n==1) {
                                polygon.point1 = i;
                                polygon.point2 = i+1;
                                polygon.point3 = i+numPointsX+1;
                                polygon.setAttribute('points',topLeftX+','+topLeftY+' '+topRightX+','+topRightY+' '+bottomRightX+','+bottomRightY);
                            }
                        } else if(rando==1) {
                            if(n==0) {
                                polygon.point1 = i;
                                polygon.point2 = i+numPointsX;
                                polygon.point3 = i+1;
                                polygon.setAttribute('points',topLeftX+','+topLeftY+' '+bottomLeftX+','+bottomLeftY+' '+topRightX+','+topRightY);
                            } else if(n==1) {
                                polygon.point1 = i+numPointsX;
                                polygon.point2 = i+1;
                                polygon.point3 = i+numPointsX+1;
                                polygon.setAttribute('points',bottomLeftX+','+bottomLeftY+' '+topRightX+','+topRightY+' '+bottomRightX+','+bottomRightY);
                            }
                        }
                        polygon.setAttribute('fill','rgba(0,0,0,'+(Math.random()/3)+')');
                        var animate = document.createElementNS('http://www.w3.org/2000/svg','animate');
                        animate.setAttribute('fill','freeze');
                        animate.setAttribute('attributeName','points');
                        animate.setAttribute('dur',refreshDuration+'ms');
                        animate.setAttribute('calcMode','linear');
                        polygon.appendChild(animate);
                        svg.appendChild(polygon);
                    }
                }
            }
        
            refresh();
        
        }
        
        function randomize() {
            for(var i = 0; i < points.length; i++) {
                if(points[i].originX != 0 && points[i].originX != unitWidth*(numPointsX-1)) {
                    points[i].x = points[i].originX + Math.random()*unitWidth-unitWidth/2;
                }
                if(points[i].originY != 0 && points[i].originY != unitHeight*(numPointsY-1)) {
                    points[i].y = points[i].originY + Math.random()*unitHeight-unitHeight/2;
                }
            }
        }
        
        function refresh() {
            randomize();
            for(var i = 0; i < document.querySelector('#bg svg').childNodes.length; i++) {
                var polygon = document.querySelector('#bg svg').childNodes[i];
                var animate = polygon.childNodes[0];
                if(animate.getAttribute('to')) {
                    animate.setAttribute('from',animate.getAttribute('to'));
                }
                animate.setAttribute('to',points[polygon.point1].x+','+points[polygon.point1].y+' '+points[polygon.point2].x+','+points[polygon.point2].y+' '+points[polygon.point3].x+','+points[polygon.point3].y);
                animate.beginElement();
            }
            refreshTimeout = setTimeout(function() {refresh();}, refreshDuration);
        }
        
        function onResize() {
            document.querySelector('#bg svg').remove();
            clearTimeout(refreshTimeout);
            onLoad();
        }
        
        window.onload = onLoad;
        window.onresize = onResize;
        
// End of Low-poly background animations

