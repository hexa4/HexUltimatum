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
///END FUNCION DEL BOTON JUGAR PLAY SE INICIA JUEGO
    
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
	let noMover = false;
	let checkSecure = 0;
	let Cam = 1;
	const players = {}; // Usaremos un objeto para almacenar los jugadores
        let redCirclesGroup;
        let hexagonGroup,hexagonGroup2;
        let playerNameCircle;
	let checkbox, fixedText, hitArea;
        let checkboxSize = 20;
        let isChecked = true;
	let intervalo;
	const hexagonMap = [
        [{ direction: 'NE' }, { direction: 'E' }, { direction: 'SE' }, { direction: 'E' }],
        [{ direction: 'SW' }, { direction: 'ES' } ,{ direction: 'E' }, { direction: 'ES' }, { direction: 'E' }],
        [{ direction: 'SW' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }]
    	];

//CLASE PLAYER 
//CLASE PLAYER  
//CLASE PLAYER   
  class Player {
    	constructor(scene, id, name, x, y, size, skin, puntos,color) {
        this.scene = scene;
        this.id = id;
        this.name = name;
        this.size = size;
        this.x = x;
        this.y = y;
        this.skin = skin;
        this.puntos = puntos;
        this.color = color;
        //TAMANO DEL JUGADOR
        const sizeCalc = (0.01 * puntos) + 0.2;		
	    
	this.circle = this.scene.physics.add.image(x, y, id);
     //   this.circle.setScale(sizeCalc); 
	this.circle.setScale(2);	
        this.circle.setInteractive();

        // Texto encima del jugador
        this.text = this.scene.add.text(Math.round(x), Math.round(y - 20), name + ' (' + puntos + ')', { fontSize: '12px', fill: '#ffffff'  , resolution: dpi * 2  , fontFamily: 'Roboto'});
        this.text.setOrigin(0.5);
	this.text.setShadow(2, 2, 'blue', 5);
	
        
	//CAMARA PARA CLIENTE INDIVIDUAL
        if (id === socket.id) {
        this.scene.cameras.main.startFollow(this.circle);
        this.scene.physics.add.overlap(this.circle, null, this.scene);
        }
        
	this.circle.type = 'player';
	this.circle.id = id;
    }

    
stopCameraFollow() {
        this.scene.cameras.main.stopFollow();
}
    
fontSizePlayer(number) {
        this.text.setFontSize(number); 
}
    
startCameraFollow() {
        this.scene.cameras.main.startFollow(this.circle);
}
    
setPosition(x, y) {
        this.circle.setPosition(x, y);
        this.text.setPosition(x, y - 20);
        this.x = x;
        this.y = y;
}

updateGraphicsPosition() {
        if (this.circle && this.text) {
            this.circle.x = this.x;
            this.circle.y = this.y;
            this.text.x = this.x;
            this.text.y = this.y - 20;
        }
}   
    

    
destroyPlayer(suID) {
        if (this.id === socket.id) {
            this.stopCameraFollow();
        }
        // Eliminar el círculo del jugador
        if (this.circle) {
            this.circle.destroy();
        }
        // Eliminar el texto del jugador
        if (this.text) {
            this.text.destroy();
        }
        // Eliminar el jugador del grupo de círculos verdes si es necesario
        if (this.greenCirclesGroup) {
            this.greenCirclesGroup.remove(this.circle);
        }
        delete players[suID]; 
} 

} //END PLAYER CLASS //END PLAYER CLASS //END PLAYER CLASS //END PLAYER CLASS //END PLAYER CLASS 

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


//UPDATE PLAYERS!!!!!! // AND CREATE PLAYERS //UPDATE PLAYERS!!!!!! // AND CREATE PLAYERS

socket.on('updatePlayers', updatedPlayers => {
console.log('SOCKET UPDATE PLAYERS');	
for (const playerId in updatedPlayers) {
const playerData = updatedPlayers[playerId];
console.log("Jugador:", playerData);
// Si el jugador ya existe, actualiza su posición
if (players[playerData.id]) {
} else {
// Si el jugador no existe, créalo y añádelo al objeto players
const playerKey = `player_${playerData.id}`; // Llave única para cada jugador
if (!this.textures.exists(playerKey)) {
const svgBlob = new Blob([playerData.skin], { type: 'image/svg+xml;charset=utf-8' });
const svgUrl = URL.createObjectURL(svgBlob);
this.load.image(playerData.id, svgUrl);
this.load.once('complete', () => {
//INVALIDAR IMAGEN DESPEUS DE CARGARLA
URL.revokeObjectURL(svgUrl);
const player = new Player(this, playerData.id, playerData.name, playerData.x, playerData.y, 10, playerData.skin, this.greenCirclesGroup, playerData.puntos,playerData.color);
players[playerData.id] = player;
console.log('SE CREA PLAYER', players[playerData.id]);
socket.emit('crearTopPlayers');

if(socket.id===playerData.id){
console.log("Ejecutar Top Players");
//socket.emit('crearTopPlayers');
}
});
this.load.start();
} else {
const player = new Player(this, playerData.id, playerData.name, playerData.x, playerData.y, 10, playerData.skin, this.greenCirclesGroup, playerData.puntos,playerData.color);
players[playerData.id] = player;
}
}
}
});

///ANIMATE PLAYER MOVE // MOVE PLAYER FROM SERVER - ///ANIMATE PLAYER MOVE // MOVE PLAYER FROM SERVER - 
///ANIMATE PLAYER MOVE // MOVE PLAYER FROM SERVER - ///ANIMATE PLAYER MOVE // MOVE PLAYER FROM SERVER - 
///ANIMATE PLAYER MOVE // MOVE PLAYER FROM SERVER - ///ANIMATE PLAYER MOVE // MOVE PLAYER FROM SERVER - 
///ANIMATE PLAYER MOVE // MOVE PLAYER FROM SERVER - ///ANIMATE PLAYER MOVE // MOVE PLAYER FROM SERVER - 
socket.on('animatePlayer', animationData => {
    	const playerId = animationData.playerId;
    	const player = players[playerId];
	const data = animationData.data;
    	const endX = data.end.x;
    	const endY = data.end.y;
    
	this.tweens.add({
                targets: [player.circle],
               	x: { value: endX, duration: data.speed, ease: 'Power2' },
    		y: { value: endY, duration: data.speed, ease: 'Power2' },
                duration: data.speed,
                ease: 'Power2',
                onUpdate: function(tween) {
			player.text.setPosition(player.circle.x, player.circle.y - 20);
              		},
               	onComplete: function() {
               	if(socket.id === playerId){
        		this.updateRedVertices.call(this, endX, endY);
        		socket.emit('updatePosition', { x: endX, y: endY });
        		noMover = false;
             
		}
    	},
        onCompleteScope: this
  	});
});    
///END ANIMATE PLAYER MOVE
	

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

            scale: {
		        mode: isMobile ? Phaser.Scale.RESIZE : Phaser.Scale.RESIZE,

                autoCenter: Phaser.Scale.CENTER_BOTH
            },
        	scene: [GameScene, UIScene],
           pixelArt: false,
            roundPixels: false,
antialias: true,
		resolution: window.devicePixelRatio * 2

        };

        const game = new Phaser.Game(config);
	game.scene.start('GameScene');

	
}  //END FUNCTION START GAME!!!!
