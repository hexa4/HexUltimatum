const dpi = window.devicePixelRatio;
const width = window.innerWidth * dpi;
const height = window.innerHeight * dpi;
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

let playerName;
let playerNameInput = document.getElementById('playerName');
let errorMessage = document.getElementById('errorMessage');
let submitButton = document.getElementById('submitButton');
const nameForm = document.getElementById('nameForm');

///FUNCION DEL BOTON JUGAR PLAY SE INICIA JUEGO
submitButton.addEventListener('click', function() {
playerName = playerNameInput.value.trim();      
if (playerName.length === 0 || playerName.length > 20) {
errorMessage.style.display = 'block';
return; }
nameForm.style.display = 'none';
requestAnimationFrame(function() {
startGame(playerName); });
});
    
function startGame(playerName) {
   	let player;
        let hexagonGraphics,hexagonGraphics2;
        let hexagonSize = 50;
        let hexagonWidth = hexagonSize * 2;
        let hexagonHeight = Math.sqrt(3) * hexagonSize;
        let hexagons = [];
        let vertices = [];
        let redVertices = [];
	let ZoomOut = 1;
	let greenCirclesGroup;	
	let noMover = false;
	let checkSecure = 0;
	let Cam = 1;
	let fixedText1, fixedText2, fixedText3, fixedText4, fixedText5, fixedText6, fixedText7;
	const players = {}; // Usaremos un objeto para almacenar los jugadores
	let topplayers = [];	
        let redCirclesGroup;
        let hexagonGroup,hexagonGroup2;
        let playerNameCircle;
	let checkbox, fixedText, hitArea;
        let checkboxSize = 20;
        let isChecked = true;
	let Velocidad = false;
	let segundosRestantes = 5;
	let intervalo;
	const hexagonMap = [
        [{ direction: 'NE' }, { direction: 'E' }, { direction: 'SE' }, { direction: 'E' }],
        [{ direction: 'SW' }, { direction: 'ES' } ,{ direction: 'E' }, { direction: 'ES' }, { direction: 'E' }],
        [{ direction: 'SW' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }]
    	];



///GAMESCENE///////!?!?!?!?!?!??!?!?!?!?!?!?!?!?!?!?!?!?!??! /// /// ////// /// ////// /// ////// /// ////// /// ////// /// ////// /// ///
///GAMESCENE///////!?!?!?!?!?!??!?!?!?!?!?!?!?!?!?!?!?!?!??! /// /// ////// /// ////// /// ////// /// ////// /// ////// /// ////// /// ///
///GAMESCENE///////!?!?!?!?!?!??!?!?!?!?!?!?!?!?!?!?!?!?!??! /// /// ////// /// ////// /// ////// /// ////// /// ////// /// ////// /// ///

class GameScene extends Phaser.Scene {
        constructor() { super({ key: 'GameScene' }); }
        preload() { }

	//CREATE GameScene //CREATE GameScene //CREATE GameScene //CREATE GameScene 
	//CREATE GameScene //CREATE GameScene //CREATE GameScene //CREATE GameScene 
        create() {		

	//RECIBIR UPDATE POINTS AND SIZE Of PLAYER
	socket.on('updatePuntos', function(myID, puntos) {
	console.log('Recibido upDate Puntos:', myID, puntos);
	const sizeCalc = (0.01 * puntos) + 0.2;		
	players[myID].text.setText(players[myID].name + ' (' + puntos + ')');
	players[myID].circle.setScale(sizeCalc); 
	players[myID].puntos = puntos;
	if(socket.id===myID)
	fixedText6.setText('Points: '+puntos);
	});	
	
	
   
//CAM ZOOM INITIALIZATION
const zoomLevel = isMobile ? 8 / dpi : 1 / dpi; // Menos zoom en PC
this.cameras.main.setZoom(zoomLevel);
let zoomFactor = this.cameras.main.zoom; 
let worldPoint = this.cameras.main.getWorldPoint(this.cameras.main.width / 2, this.cameras.main.height / 2);


this.greenCirclesGroup = this.physics.add.group();

//HEXAGONAL MAP INITIALIZATION		
//hexagonGraphics2 = this.add.graphics({ lineStyle: { width: 6, color: 0x0077ff, alpha: 0.2 } });
//hexagonGraphics2 = this.add.graphics({ lineStyle: { width: 6, color: 0x808080 } });	
		hexagonGraphics2 = this.add.graphics({
    lineStyle: { width: 6, color: 0x808080 },
    antialias: true // Intenta añadir esta propiedad si el renderizador lo permite
});
hexagonGroup2 = this.add.group();
//hexagonGraphics = this.add.graphics({ lineStyle: { width: 2, color: 0x808080 } });
hexagonGraphics = this.add.graphics({
    lineStyle: { width: 2, color: 0x0099ff },
    antialias: true // Intenta añadir esta propiedad si el renderizador lo permite
});
		
redCirclesGroup = this.add.group();
hexagonGroup = this.add.group();

/*		
for (let y = 0; y < hexagonMap.length; y++) {
    for (let x = 0; x < hexagonMap[y].length; x++) {
        let hexX = x * hexagonWidth * 0.75;
        let hexY = y * hexagonHeight + (x % 2 === 0 ? 0 : hexagonHeight / 2);
        // Opcional: Usa la dirección del hexágono si es necesario
        let direction = hexagonMap[y][x].direction;
        //console.log(`Hexágono en (${x}, ${y}) tiene dirección: ${direction}`);
        this.drawHexagon2(hexX, hexY, hexagonSize);
        hexagons.push({ x: hexX, y: hexY });
        vertices.push(...this.getHexVertices(hexX, hexY));
        hexagonGroup2.add(hexagonGraphics2); // Añadir el gráfico del hexágono al grupo
    }
}  
	*/	
// Crear el mapa hexagonal
for (let y = 0; y < hexagonMap.length; y++) {
    for (let x = 0; x < hexagonMap[y].length; x++) {
        let hexX = x * hexagonWidth * 0.75;
        let hexY = y * hexagonHeight + (x % 2 === 0 ? 0 : hexagonHeight / 2);
        // Opcional: Usa la dirección del hexágono si es necesario
        let direction = hexagonMap[y][x].direction;
       	//console.log(`Hexágono en (${x}, ${y}) tiene dirección: ${direction}`);
        this.drawHexagon(hexX, hexY, hexagonSize);
        hexagons.push({ x: hexX, y: hexY });
        vertices.push(...this.getHexVertices(hexX, hexY));
        hexagonGroup.add(hexagonGraphics); // Añadir el gráfico del hexágono al grupo
    }
}

// Crear el jugador en un vértice aleatorio
const randomHex = hexagons[Phaser.Math.Between(0, hexagons.length - 1)];
const randomVertex = this.getHexVertices(randomHex.x, randomHex.y)[Phaser.Math.Between(0, 5)];
player = this.add.circle(randomVertex.x, randomVertex.y, 0, 0xffffff);

socket.emit('newPlayer', { name: playerName, x: randomVertex.x, y: randomVertex.y, skin: skinCode });       
this.updateRedVertices.call(this, randomVertex.x, randomVertex.y); 
//console.log("COORDS", randomVertex.x,randomVertex.y);
this.input.on('pointerdown', this.onPointerDown, this);



game.scene.start('UIScene');
game.scene.bringToTop('UIScene');

	
}
//END CREATE GAME SCENE END CREATE
//END CREATE GAME SCENE END CREATE
//END CREATE GAME SCENE END CREATE
//END CREATE GAME SCENE END CREATE
//END CREATE GAME SCENE END CREATE

update() { }

drawHexagon(x, y, size) {
	const points = this.getHexVertices(x, y, size);
        hexagonGraphics.strokePoints(points, true);
}
drawHexagon2(x, y, size) {
	const points = this.getHexVertices(x, y, size);
        hexagonGraphics2.strokePoints(points, true);
}
getHexVertices(x, y, size = hexagonSize) {
        const points = [];
        for (let i = 0; i < 6; i++) {
                const angle = Phaser.Math.DegToRad(60 * i);
                const px = x + size * Math.cos(angle);
                const py = y + size * Math.sin(angle);
                points.push(new Phaser.Geom.Point(px, py));
        } return points;
}

getVerticesInRadius(x, y, radius) {
		return vertices.filter(vertex => {
                let distance = Phaser.Math.Distance.Between(x, y, vertex.x, vertex.y);
                return distance <= radius && distance > 20; });
}

//CLICK EN LA PANTALLA  
//CLICK EN LA PANTALLA            
//CLICK EN LA PANTALLA                      
onPointerDown(pointer) { 
	if(checkSecure===0){
        	if(noMover===false){
        		noMover = true;
        let cameraX = this.cameras.main.scrollX;
    	let cameraY = this.cameras.main.scrollY;
    	console.log(`Camera coordinates: (${cameraX}, ${cameraY})`); 
	console.log(`Click: (${pointer.x + cameraX}, ${pointer.y + cameraY}) `);	
        //console.log(`ClickW: (${pointer.worldX + cameraX}, ${pointer.worldY + cameraY}) `);	
	let worldPoint = this.cameras.main.getWorldPoint(this.cameras.main.width / 2, this.cameras.main.height / 2);
	console.log(`World coordinates: (${worldPoint.x}, ${worldPoint.y})`);
	
	let closestRedVertex = this.findClosestRedVertexToClick(pointer.x + cameraX, pointer.y + cameraY, cameraX, cameraY);

	if(ZoomOut === 1){
		 closestRedVertex = this.findClosestRedVertexToClick(pointer.x + cameraX, pointer.y + cameraY, cameraX, cameraY);
       	        console.log(`1 Closest Click: (${closestRedVertex.x}, ${closestRedVertex.y}) `);	

	}


			
    	if(ZoomOut === 2){
	    let worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    	//let worldPoint = this.cameras.main.getWorldPoint(this.cameras.main.width / 2, this.cameras.main.height / 2);
		// closestRedVertex = this.findClosestRedVertexToClick(pointer.x + worldPoint.x, pointer.y + worldPoint.y, cameraX, cameraY);
	closestRedVertex = this.findClosestRedVertexToClick(
        worldPoint.x, 
        worldPoint.y, 
        this.cameras.main.scrollX, 
        this.cameras.main.scrollY
    );

	        console.log(`2 Closest Click: (${closestRedVertex.x}, ${closestRedVertex.y}) `);	
	
	}


			

	//ENVIAR A SERVER QUE SE EJECUTE MOVIMIENTO EN TODOS
	const player = players[socket.id];
	let VelocidadValor = 0;
	if(Velocidad===true){
	VelocidadValor = 50;
	}else if (Velocidad===false){
		VelocidadValor = 500;
	}
	socket.emit('animationData', { start: { x: player.x, y: player.y }, end: { x: closestRedVertex.x, y: closestRedVertex.y }, speed: VelocidadValor });
              
	}
	}
	checkSecure = 0;
} //END POINTER CLICK

//FIND CLOSEST RED VERTEX  
//FIND CLOSEST RED VERTEX            
//FIND CLOSEST RED VERTEX                              
findClosestRedVertexToClick(x, y) {
            let closestVertex = null;
            let minDistance = Infinity;
            redVertices.forEach(vertex => {
                const dist = Phaser.Math.Distance.Between(x, y, vertex.x, vertex.y);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestVertex = vertex;
                }
            }); return closestVertex;
}
                                     
//CLEAR RED VERTEX                                                                         
 clearRedVertices() {
	redCirclesGroup.clear(true, true);  // Borra todos los elementos del grupo redCirclesGroup
    	redVertices = []; 
}
		
//UPDATE RED VERTEX POINTS        
updateRedVertices(x, y) {
	this.clearRedVertices.call(this);  
    	const verticesInRadius = this.getVerticesInRadius(x, y, 60); // Radio de 60 píxeles
    	verticesInRadius.forEach(vertex => { 
    	redVertices.push({ x: vertex.x, y: vertex.y });
    	//console.log(`redVertex: (${vertex.x}, ${vertex.y}) `);	
   	const graphics = this.add.graphics();
    	graphics.fillStyle(0xff0000, 1); // Color rojo, opacidad 1
    	graphics.fillCircle(vertex.x, vertex.y, 4); // Dibuja un círculo en la posición (vertex.x, vertex.y) con radio 5
	redCirclesGroup.add(graphics);                        
    });         
}       
//END UPDATE RED VERTEX POINTS   
		
///TOP PLATERS SYSTEM
 addPlayer(name, puntos, color) {
	const nuevoJugador = { name: name, puntos: puntos, color: color };
	topplayers.push(nuevoJugador);
}
getTopPlayers() {
	const sortedPlayers = topplayers.sort((a, b) => b.puntos - a.puntos);
	const topPlayersx = sortedPlayers.slice(0, 5);
	topPlayersx.forEach(topplayer => { });
	return topPlayersx;
}	

//GAME OVER FUNCTION	
gameOver(){
	let pointsText = fixedText6.text;

    // Encuentra el elemento HTML
    let pointsElement = document.getElementById('points');

    // Actualiza el texto del elemento con el puntaje
    pointsElement.innerText = pointsText;

	document.getElementById("retryBox").style.visibility = "visible";
	var retryButton = document.getElementById("retryButton");
	retryButton.onclick = function() {
	console.log("Retry Game.");
	location.reload();
	};	
}

//DRAW GREEN CIRCLES!!!!!!


















///GAMESCENE END !!!/!?!?!?!?!?!?!?!?!?!?	
///GAMESCENE END !!!/!?!?!?!?!?!?!?!?!?!?	
///GAMESCENE END !!!/!?!?!?!?!?!?!?!?!?!?		
}  


//UISCENE!!!!!!////!!! / / /// // / / / / / / / / // / / / / / / 	
//UISCENE!!!!!!////!!! / / /// // / / / / / / / / // / / / / / / 	
//UISCENE!!!!!!////!!! / / /// // / / / / / / / / // / / / / / / 	
//UISCENE!!!!!!////!!! / / /// // / / / / / / / / // / / / / / / 	
//UISCENE!!!!!!////!!! / / /// // / / / / / / / / // / / / / / / 	
//UISCENE!!!!!!////!!! / / /// // / / / / / / / / // / / / / / / 		
class UIScene extends Phaser.Scene {
        constructor() {super({ key: 'UIScene' });}
        
         create() {
         console.log(`INICIADO UISCENE!!!!`);

	const zoomLevel = isMobile ? 8 / dpi : 1 / dpi; // Menos zoom en PC
        this.cameras.main.setZoom(zoomLevel);
	let zoomFactor = this.cameras.main.zoom; 
	let worldPoint = this.cameras.main.getWorldPoint(this.cameras.main.width / 2, this.cameras.main.height / 2);

//	const textResolution = dpi > 1 ? dpi * 2 : dpi;
	 
		 
fixedText1 = this.add.text(10, 10, '', { fontSize: '16px', fill: '#ffffff'  , resolution: dpi * 2 , fontFamily: 'Roboto' });
fixedText1.setShadow(2, 2, 'blue', 5);
fixedText2 = this.add.text(10, 30, '', { fontSize: '16px', fill: '#ffffff'  , resolution: dpi * 2   , fontFamily: 'Roboto' });
fixedText2.setShadow(2, 2, 'blue', 5);
fixedText3 = this.add.text(10, 50, '', { fontSize: '16px', fill: '#ffffff'  , resolution: dpi * 2  , fontFamily: 'Roboto' });
fixedText4 = this.add.text(10, 70, '', { fontSize: '16px', fill: '#ffffff'  , resolution: dpi * 2   , fontFamily: 'Roboto' });
fixedText5 = this.add.text(10, 90, '', { fontSize: '16px', fill: '#ffffff'  , resolution: dpi * 2   , fontFamily: 'Roboto' });
fixedText6 = this.add.text(window.innerWidth * dpi - 10, 10 * dpi, 'Points: 0', { fontSize: '16px', fill: '#ffffff'   , resolution: dpi * 2  , fontFamily: 'Roboto' });
fixedText7 = this.add.text(window.innerWidth * dpi - 10, 10 * dpi, 'X2 SPEED - 5 s', { fontSize: '16px', fill: '#ffffff'   , resolution: dpi * 2  , fontFamily: 'Roboto' });
        // Hace que los textos no se muevan con la cámara
fixedText1.setScrollFactor(0);
fixedText2.setScrollFactor(0);
fixedText3.setScrollFactor(0);
fixedText4.setScrollFactor(0);
fixedText5.setScrollFactor(0);
fixedText6.setScrollFactor(0);
fixedText7.setScrollFactor(0);

fixedText3.setShadow(2, 2, 'blue', 5);
fixedText4.setShadow(2, 2, 'blue', 5);
fixedText5.setShadow(2, 2, 'blue', 5);
fixedText6.setShadow(2, 2, 'blue', 5);
fixedText7.setShadow(2, 2, 'blue', 5);
		 

fixedText1.setPosition( 	
worldPoint.x - (this.cameras.main.width / 2) / zoomFactor + 10, 
worldPoint.y - (this.cameras.main.height / 2) / zoomFactor + 10); 

fixedText2.setPosition( 	
worldPoint.x - (this.cameras.main.width / 2) / zoomFactor + 10, 
worldPoint.y - (this.cameras.main.height / 2) / zoomFactor + 30); 

fixedText3.setPosition( 	
worldPoint.x - (this.cameras.main.width / 2) / zoomFactor + 10, 
worldPoint.y - (this.cameras.main.height / 2) / zoomFactor + 50); 

fixedText4.setPosition( 	
worldPoint.x - (this.cameras.main.width / 2) / zoomFactor + 10, 
worldPoint.y - (this.cameras.main.height / 2) / zoomFactor + 70); 

fixedText5.setPosition( 	
worldPoint.x - (this.cameras.main.width / 2) / zoomFactor + 10, 
worldPoint.y - (this.cameras.main.height / 2) / zoomFactor + 90); 

fixedText6.setPosition(worldPoint.x + (this.cameras.main.width / 2) / zoomFactor - fixedText6.width - 20, 
worldPoint.y - (this.cameras.main.height / 2) / zoomFactor + 10);

		 
fixedText7.visible = false;
fixedText7.setPosition(worldPoint.x + (this.cameras.main.width / 2) / zoomFactor - fixedText7.width - 20, 
worldPoint.y - (this.cameras.main.height / 2) / zoomFactor + 30);
//fixedText7.setText("");

//CHECKBOXES FOR ZOOM AND CAMERA		 
let lineWidth = 2; 	
let boxSize = 20;
let boxX = worldPoint.x - (this.cameras.main.width / 2) / zoomFactor + 10;
let boxY = worldPoint.y + (this.cameras.main.height / 2) / zoomFactor - boxSize*2 - 20;
// Añadir texto fijo en la pantalla y centrarlo verticalmente con el checkbox
let textYOffset = boxSize / 2;
let staticText = this.add.text(boxX + boxSize + 10, boxY + textYOffset, 'Zoom', { fontSize: '16px', fill: '#ffffff' , resolution: dpi * 2 , fontFamily: 'Roboto'   });
staticText.setShadow(2, 2, 'blue', 5);
staticText.setOrigin(0, 0.5); // Ajuste vertical para centrar con el checkbox
staticText.setScrollFactor(0); // Esto fija el texto para que no se desplace con la cámara
// Crear el gráfico del checkbox
let box = this.add.graphics();
// Dibujar el checkbox
box.fillStyle(0x00ff00); // Color verde
box.fillRect(boxX, boxY, boxSize, boxSize);
// Estado inicial del checkbox
let isBoxChecked = true;
// Función para dibujar o borrar la "X"
let drawBoxCheck = (isBoxChecked) => {
    box.clear();
    box.fillStyle(0x00ff00); // Color verde
    box.fillRect(boxX, boxY, boxSize, boxSize);
    if (isBoxChecked) {
        box.lineStyle(lineWidth, 0x000000); // Color negro para la "X"
        box.beginPath();
        box.moveTo(boxX, boxY);
        box.lineTo(boxX + boxSize, boxY + boxSize);
        box.moveTo(boxX + boxSize, boxY);
        box.lineTo(boxX, boxY + boxSize);
        box.strokePath();
    }
};
// Dibujar el estado inicial del checkbox
drawBoxCheck(isBoxChecked);
// Hacer que el checkbox sea interactivo
let hitAreaBox = new Phaser.Geom.Rectangle(boxX, boxY, boxSize, boxSize);
box.setInteractive(hitAreaBox, Phaser.Geom.Rectangle.Contains);
let toggleBox = () => {
    	isBoxChecked = !isBoxChecked;
    	drawBoxCheck(isBoxChecked); 
    	checkSecure = 1;
    	ZoomOut = 1;
	let playerLocal = players[socket.id];
    	if (isBoxChecked) {
        //this.cameras.main.setZoom(8 / dpi);
		//this.scene.get('GameScene').cameras.main.setZoom(8 / dpi);
        //let zoomFactor = this.cameras.main.zoom; 
		const zoomLevel = isMobile ? 8 / dpi : 1 / dpi; // Menos zoom en PC
                this.scene.get('GameScene').cameras.main.setZoom(zoomLevel);

		    	ZoomOut = 1;

		//playerLocal.fontSizePlayer(12);
		Object.values(players).forEach(player => {
    		player.fontSizePlayer(12); // Cambia el tamaño de la fuente a 24px para cada jugador
		});
    	} else {
		const zoomLevel = isMobile ? 4 / dpi : 0.5 / dpi; // Menos zoom en PC
                this.scene.get('GameScene').cameras.main.setZoom(zoomLevel);

		    	ZoomOut = 2;

		
		//playerLocal.fontSizePlayer(24);
		Object.values(players).forEach(player => {
    		player.fontSizePlayer(24); // Cambia el tamaño de la fuente a 24px para cada jugador
		});

		
    	}
};
box.on('pointerdown', toggleBox);
// Hacer que el texto sea interactivo y reaccione de la misma manera que el checkbox
staticText.setInteractive();
staticText.on('pointerdown', toggleBox);
// Fijar el checkbox y el texto para que no se desplacen con la cámara
box.setScrollFactor(0);
staticText.setScrollFactor(0);

//CHECKBOX CAM MOVE//////////////////
// Tamaño y posición del checkbox
let checkboxSize = 20;
let checkboxX =   worldPoint.x - (this.cameras.main.width / 2) / zoomFactor + 10 ;
let checkboxY = worldPoint.y + (this.cameras.main.height / 2) / zoomFactor - checkboxSize - 10;
// Añadir texto fijo en la pantalla y centrarlo verticalmente con el checkbox
let textOffsetY = checkboxSize / 2;
let fixedText = this.add.text(checkboxX + checkboxSize + 10, checkboxY + textOffsetY, 'Centered Cam', { fontSize: '16px', fill: '#ffffff' , resolution: dpi * 2   , fontFamily: 'Roboto'});
fixedText.setShadow(2, 2, 'blue', 5);
fixedText.setOrigin(0, 0.5); // Ajuste vertical para centrar con el checkbox
fixedText.setScrollFactor(0); // Esto fija el texto para que no se desplace con la cámara
// Crear el gráfico del checkbox
let checkbox = this.add.graphics();
// Dibujar el checkbox
checkbox.fillStyle(0x00ff00); // Color verde
checkbox.fillRect(checkboxX, checkboxY, checkboxSize, checkboxSize);
// Estado inicial del checkbox
let isChecked = true;
// Función para dibujar o borrar la "X"
        let drawCheck = (isChecked) => {
            checkbox.clear();
            checkbox.fillStyle(0x00ff00); // Color verde
            checkbox.fillRect(checkboxX, checkboxY, checkboxSize, checkboxSize);
            if (isChecked) {
                checkbox.lineStyle(lineWidth, 0x000000); // Color negro para la "X"
                checkbox.beginPath();
                checkbox.moveTo(checkboxX, checkboxY);
                checkbox.lineTo(checkboxX + checkboxSize, checkboxY + checkboxSize);
                checkbox.moveTo(checkboxX + checkboxSize, checkboxY);
                checkbox.lineTo(checkboxX, checkboxY + checkboxSize);
                checkbox.strokePath();
            }
        };
        // Dibujar el estado inicial del checkbox
        drawCheck(isChecked);
        // Hacer que el checkbox sea interactivo
        let hitArea = new Phaser.Geom.Rectangle(checkboxX, checkboxY, checkboxSize, checkboxSize);
        checkbox.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
        let toggleCheckbox = () => {
            	isChecked = !isChecked;
            	drawCheck(isChecked);
            	checkSecure = 1;
    		let playerLocal = players[socket.id];
            if (isChecked) {
                Cam = 1;
                console.log('Checkbox checked, Cam =', Cam);
                playerLocal.startCameraFollow();

            } else {
                Cam = 2;
                console.log('Checkbox unchecked, Cam =', Cam);
                playerLocal.stopCameraFollow();
            }
        };
        checkbox.on('pointerdown', toggleCheckbox);
        // Hacer que el texto sea interactivo y reaccione de la misma manera que el checkbox
        fixedText.setInteractive();
        fixedText.on('pointerdown', toggleCheckbox);
        // Fijar el checkbox y el texto para que no se desplacen con la cámara
        checkbox.setScrollFactor(0);
        fixedText.setScrollFactor(0);  



	 		
window.addEventListener('resize', () => resizeTexts(this));

function resizeTexts(scene) {
    console.log(`RESIZE!!!!`);

    const worldPoint = scene.cameras.main.midPoint; // Asumimos que este es el punto central que estás usando
    const zoomFactor = scene.cameras.main.zoom;

    fixedText1.setPosition( 	
        worldPoint.x - (scene.cameras.main.width / 2) / zoomFactor + 10, 
        worldPoint.y - (scene.cameras.main.height / 2) / zoomFactor + 10
    ); 

    fixedText2.setPosition( 	
        worldPoint.x - (scene.cameras.main.width / 2) / zoomFactor + 10, 
        worldPoint.y - (scene.cameras.main.height / 2) / zoomFactor + 30
    ); 

    fixedText3.setPosition( 	
        worldPoint.x - (scene.cameras.main.width / 2) / zoomFactor + 10, 
        worldPoint.y - (scene.cameras.main.height / 2) / zoomFactor + 50
    ); 

    fixedText4.setPosition( 	
        worldPoint.x - (scene.cameras.main.width / 2) / zoomFactor + 10, 
        worldPoint.y - (scene.cameras.main.height / 2) / zoomFactor + 70
    ); 

    fixedText5.setPosition( 	
        worldPoint.x - (scene.cameras.main.width / 2) / zoomFactor + 10, 
        worldPoint.y - (scene.cameras.main.height / 2) / zoomFactor + 90
    ); 

    fixedText6.setPosition(
        worldPoint.x + (scene.cameras.main.width / 2) / zoomFactor - fixedText6.width - 20, 
        worldPoint.y - (scene.cameras.main.height / 2) / zoomFactor + 10
    );

    fixedText7.setPosition(
        worldPoint.x + (scene.cameras.main.width / 2) / zoomFactor - fixedText7.width - 20, 
        worldPoint.y - (scene.cameras.main.height / 2) / zoomFactor + 30
    );
    	//fixedText7.setText(`X2 SPEED - 5 s`);
    	//fixedText7.setText(`              `);



boxSize = 20;
boxX = worldPoint.x - (scene.cameras.main.width / 2) / zoomFactor + 10;
boxY = worldPoint.y + (scene.cameras.main.height / 2) / zoomFactor - boxSize*2 - 20;
// Añadir texto fijo en la pantalla y centrarlo verticalmente con el checkbox
textYOffset = boxSize / 2;	
staticText.setPosition(boxX + boxSize + 10, boxY + textYOffset);
drawBoxCheck(isBoxChecked);



checkboxSize = 20;
checkboxX =   worldPoint.x - (scene.cameras.main.width / 2) / zoomFactor + 10 ;
checkboxY = worldPoint.y + (scene.cameras.main.height / 2) / zoomFactor - checkboxSize - 10;
// Añadir texto fijo en la pantalla y centrarlo verticalmente con el checkbox
textOffsetY = checkboxSize / 2;
fixedText.setPosition(checkboxX + checkboxSize + 10, checkboxY + textOffsetY);
drawCheck(isChecked);

	


	
}


		 
        } //END CREATE UISCENE
            
        update() {}
        preload() {
	}
         
}
//END UISCENE!!!!!!////!!! / / /// // / / / / / / / / // / / / / / / 	
//END UISCENE!!!!!!////!!! / / /// // / / / / / / / / // / / / / / / 	
//END UISCENE!!!!!!////!!! / / /// // / / / / / / / / // / / / / / / 	
//END UISCENE!!!!!!////!!! / / /// // / / / / / / / / // / / / / / / 	

//CONFIG SCENEN/////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const config = {
            type: Phaser.AUTO,
            width: width,
            height: height,
		physics: {
        	default: 'arcade',
        	arcade: {
            gravity: { y: 0 }, // Puedes ajustar la gravedad según lo necesites
            debug: false // Puedes activar esto para ver los cuerpos de colisión
        			} },
            backgroundColor: '#000000',
		      //      backgroundColor: '#0B1E00',

            scale: {
              // mode: Phaser.Scale.FIT,
		//mode: Phaser.Scale.RESIZE, // Mantén el tamaño del juego fijo

		        mode: isMobile ? Phaser.Scale.RESIZE : Phaser.Scale.RESIZE,

                autoCenter: Phaser.Scale.CENTER_BOTH
            },
        	scene: [GameScene, UIScene],
           pixelArt: false,
//pixelArt: true,
            roundPixels: false,
antialias: true,
		resolution: window.devicePixelRatio * 2

		/* render: {
        pixelArt: false,
        antialias: true,
    },


*/
        };

        const game = new Phaser.Game(config);
	game.scene.start('GameScene');

	// Listener para el redimensionamiento de la ventana
/*window.addEventListener('resize', () => {
    const newWidth = window.innerWidth * dpi;
    const newHeight = window.innerHeight * dpi;
    game.scale.resize(newWidth, newHeight);
    game.scene.scenes.forEach(scene => {
        if (scene.cameras.main) {
            scene.cameras.main.setViewport(0, 0, newWidth, newHeight);
        }
    });
});*/

	
}  //END FUNCTION START GAME!!!!
