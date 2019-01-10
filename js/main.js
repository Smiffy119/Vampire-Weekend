window.onload = function() {
	//Calling the init function and getting the height and width of the window
	init();
}

//Init function
function init(){
	//When called will print "init fired"
	console.log("init fired");
}

var video = document.getElementById("MainVideo");

function off() {
    document.getElementById("overlay").style.display = "none";
}

function openNav() {
 	document.getElementById("mySideNav").style.width = "250px";
}

function closeNav() {
 	document.getElementById("mySideNav").style.width = "0";
}

/*------------------------------
        Album Cover Slider
--------------------------------*/
//start added by Chase

var a = document.getElementsByClassName("a");
var cfImg = document.getElementsByClassName("coverflow_image");

var scaleI = 0;
for (scaleI; scaleI < a.length; scaleI++){
	if (scaleI === 3) {
		continue;
	} 
	else{
		a[scaleI].style.cursor = "default";
		a[scaleI].addEventListener("click", prevDef);
	}
}

function prevDef(e){
	e.preventDefault();
}

function forScale(coverflowpos){
	for (scaleI = 0; scaleI < a.length; scaleI++){
		a[scaleI].style.cursor = "default"
		a[scaleI].addEventListener("click", prevDef)
	}
	for (scaleI = 0; scaleI < cfImg.length; scaleI++){
		if (cfImg[scaleI].getAttribute("data-coverflow-index") == coverflowpos){
			cfImg[scaleI].parentElement.style.cursor = "pointer";
			cfImg[scaleI].parentElement.removeEventListener("click", prevDef);
		}	
	}
}

//end added by Chase

function setupCoverflow(coverflowContainer) {
  var coverflowContainers;

  if (typeof coverflowContainer !== "undefined") {
    if (Array.isArray(coverflowContainer)) {
      coverflowContainers = coverflowContainer;
    } else {
      coverflowContainers = [coverflowContainer];
    }
  } else {
    coverflowContainers = Array.prototype.slice.apply(document.getElementsByClassName('coverflow'));
  }

  coverflowContainers.forEach(function(containerElement) {
    var coverflow = {};
    var prevArrows, nextArrows;

    //capture coverflow elements
    coverflow.container = containerElement;
    coverflow.images = Array.prototype.slice.apply(containerElement.getElementsByClassName('coverflow__image'));
    coverflow.position = Math.floor(coverflow.images.length / 2) + 1;

    //set indicies on images
    coverflow.images.forEach(function(coverflowImage, i) {
      coverflowImage.dataset.coverflowIndex = i + 1;
    });

    //set initial position
    coverflow.container.dataset.coverflowPosition = coverflow.position;

    //get prev/next arrows
    prevArrows = Array.prototype.slice.apply(coverflow.container.getElementsByClassName("prev-arrow"));
    nextArrows = Array.prototype.slice.apply(coverflow.container.getElementsByClassName("next-arrow"));

    //add event handlers
    function setPrevImage() {
      coverflow.position = Math.max(1, coverflow.position - 1);
      coverflow.container.dataset.coverflowPosition = coverflow.position;
      //call the functin forScale added
      forScale(coverflow.position);
    }

    function setNextImage() {
      coverflow.position = Math.min(coverflow.images.length, coverflow.position + 1);
      coverflow.container.dataset.coverflowPosition = coverflow.position;
      //call the function Chase added
      forScale(coverflow.position);
    }

    function jumpToImage(evt) {
      coverflow.position = Math.min(coverflow.images.length, Math.max(1, evt.target.dataset.coverflowIndex));
      coverflow.container.dataset.coverflowPosition = coverflow.position;
      //start added by Chase
      setTimeout(function() {
        forScale(coverflow.position);
      }, 1);
      //end added by Chase
    }

    function onKeyPress(evt) {
      switch (evt.which) {
        case 37: //left arrow
          setPrevImage();
          break;
        case 39: //right arrow
          setNextImage();
          break;
      }
    }
    prevArrows.forEach(function(prevArrow) {
      prevArrow.addEventListener('click', setPrevImage);
    });
    nextArrows.forEach(function(nextArrow) {
      nextArrow.addEventListener('click', setNextImage);
    });
    coverflow.images.forEach(function(image) {
      image.addEventListener('click', jumpToImage);
    });
    window.addEventListener('keyup', onKeyPress);
  });
}

setupCoverflow();

/**
  Customisable Generative Art
  Phillip Broadbent
  
  Click to generate a new iteration of random art.
  Right click to reset.
  Use dropdown to change draw piece.
  Use slider to turn random colour on/off.
*/

var canvas = document.getElementById("masterpiece");
var ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
let iteration = 0;
let numSquares, diffx, diffy, coordGrid;
let pattern, colourful, oddRowColour, eventRowColour;

var link = document.getElementById("Save");
	link.addEventListener('click', function(ev) {
	link.href = canvas.toDataURL();
	link.download = "myalbum.png";
}, false);


function generateNumbers(applyOffset) {
  numSquares = iteration * iteration;
  diffx = width / iteration;
  diffy = height / iteration;
  coordGrid = getCoords(applyOffset);
}

function getCoords(applyOffset) {
  const arr = [];
  const offsetX = applyOffset ? diffx/2 : 0;
  const offsetY =  applyOffset ? diffy/2 : 0;

  for (var x = 0; x < iteration; x++) {
    for (var y = 0; y < iteration; y++) {
      const coord = {
        x: (x * diffx) + offsetX,
        y: (y * diffy) + offsetY
      };

      arr.push(coord);
    }
  }

  return arr;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawHorizontalLine(coord) {
  const x = coord.x;
  const y = coord.y;

  ctx.beginPath();

  if (Math.random() > 0.5) {
    ctx.moveTo(x, y + diffy / 2);
    ctx.lineTo(x + diffx, y + diffy / 2);
  } else {
    ctx.moveTo(x + diffx / 2, y);
    ctx.lineTo(x + diffx / 2, y + diffy);
  }

  ctx.stroke();
}

function drawDiagonalLine(coord) {
  const x = coord.x;
  const y = coord.y;

  ctx.beginPath();

  if (Math.random() > 0.5) {
    ctx.moveTo(x, y);
    ctx.lineTo(x + diffx, y + diffy);
  } else {
    ctx.moveTo(x, y + diffy);
    ctx.lineTo(x + diffx, y);
  }

  ctx.stroke();
}

function drawQuarterArc(coord) {
  const x = coord.x;
  const y = coord.y;

  ctx.beginPath();
  const rad = diffx / 2;
  const random = Math.random();
  if (random < 0.25) {
    ctx.arc(x, y, rad, 1.5 * Math.PI, 0); //top right
  } else if (random >= 0.25 && random < 0.5) {
    ctx.arc(x, y, rad, Math.PI, 1.5 * Math.PI); //top left
  } else if (random >= 0.5 && random < 0.75) {
    ctx.arc(x, y, rad, 0.5 * Math.PI, Math.PI); //bottom left
  } else {
    ctx.arc(x, y, rad, 0, 0.5 * Math.PI); //bottom right
  }

  ctx.stroke();
}

function drawArc(coord, i) {
  const x = coord.x;
  const y = coord.y;

  if (colourful) {
    if (i % 2 === 0) {
      if (!oddRowColour) {
        oddRowColour = "#" + Math.floor(Math.random() * 16777215).toString(16);
      }
      ctx.strokeStyle = oddRowColour;
    } else {
      if (!evenRowColour) {
        evenRowColour = invertColour(oddRowColour);
      }
      ctx.strokeStyle = evenRowColour;
    }
  }

  ctx.beginPath();
  const rad = diffx / 2;
  const random = Math.random();
  if (random < 0.5) {
    ctx.arc(x, y, rad, Math.PI, 0); //top
  } else if (random >= 0.5) {
    // ctx.arc(x, y, rad,  1.5*Math.PI , 0.5*Math.PI); //right
    // ctx.arc(x, y, rad,  0.5*Math.PI, 1.5*Math.PI);
    ctx.arc(x, y, rad, 2 * Math.PI, Math.PI); //bottom
  }

  ctx.stroke();
  ctx.closePath();
}

document.addEventListener("click", function() {
  const isClickInParamsPanel = !!arguments[0].target.closest('#plaque');

  if (!isClickInParamsPanel) {
    generateRandomArt();    
  }
});

document.addEventListener("contextmenu", function(event) {
  event.preventDefault();
  iteration = 0;
  clearCanvas();
});

function generateRandomArt(doNotIncrease) {
  const dropdown = document.getElementById("dropdown");
  const dropdownValue = dropdown.selectedOptions[0].value;
  const isColourful = document.getElementById("checkboxInput").checked;
  let func;
  let applyOffset = false;

  // Reset iteration if pattern changed
  if (dropdownValue !== pattern) {
    iteration = 0;
    pattern = dropdownValue;
  }
  colourful = isColourful;
  
  if (!doNotIncrease) {
    iteration += 2;    
  }

  evenRowColour = null;
  oddRowColour = null;
  ctx.strokeStyle = "black";

  switch (dropdownValue) {
    case "diagonals":
      func = drawDiagonalLine;
      break;
    case "orthogonals":
      func = drawHorizontalLine;
      break;
    case "quarterArc":
      applyOffset = true;
      func = drawQuarterArc;
      break;
    case "halfArc":
      applyOffset = true;
      func = drawArc;
      break;
    default:
      func = drawDiagonalLine;
  }
  
  generateNumbers(applyOffset);

  clearCanvas();
  
  for (var i = 0; i < coordGrid.length; i++) {
    if (isColourful) {
      ctx.strokeStyle = "#" + Math.floor(Math.random() * 16777215).toString(16);
    }

    const startCoord = coordGrid[i];
    func(startCoord, i);
  }
}

var interval = setInterval(function() {
  //  generateRandomArt();

  if (iteration > 30) {
    clearInterval(interval);
  }
}, 1000);


function invertColour(hexStr) {
  const colours = hexStr.split('');
  
  const invertedColourMap = {
    '0': 'F',
    '1': 'E',
    '2': 'D',
    '3': 'C',
    '4': 'B',
    '5': 'A',
    '6': '9',
    '7': '8',
    '8': '7',
    '9': '6',
    'A': '5',
    'B': '4',
    'C': '3',
    'D': '2',
    'E': '1',
    'F': '0'
  };

	const invertedColours = colours.map(colour => {
    	return invertedColourMap[colour.toUpperCase()];
	}).join('');

	return '#' + invertedColours;
}

generateRandomArt();

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

document.getElementById("fileInput").onchange = function(){
  var output = document.getElementById("output");
  output.src = URL.clearObjectURL(event.target.files[0]);
};
