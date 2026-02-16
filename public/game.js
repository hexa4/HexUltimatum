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

//CLASE PLAYER 
//CLASE PLAYER  
//CLASE PLAYER   
  class Player {
    	constructor(scene, id, name, x, y, size, skin, greenCirclesGroup, puntos,color) {
        this.scene = scene;
        this.id = id;
        this.name = name;
        this.size = size;
        this.x = x;
        this.y = y;
        this.skin = skin;
        this.greenCirclesGroup = greenCirclesGroup; 
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
        this.scene.physics.add.overlap(this.circle, this.greenCirclesGroup, this.collectGreenCircle2, null, this.scene);
        }
        
	this.circle.type = 'player';
	this.circle.id = id;
        this.greenCirclesGroup.add(this.circle);  
    }

 collectGreenCircle2(player, greenCircle) {

	//COLISION WITH GREEN CIRCLE 	 
       	if(greenCircle.type === 'green'){
       	socket.emit('eliminarGreen', greenCircle.z, socket.id);
	greenCircle.destroy();
	this.textOnDestroy(this, greenCircle.x, greenCircle.y, '+1 points', '10px', '#00ff00');
	socket.emit('greenCircleEaten');
	console.log(`type ='GREEN.`);
	
       	}

	//COLISION WITH BLUE CIRCLE 
       	if(greenCircle.type === 'blue'){
       	socket.emit('eliminarGreen', greenCircle.z, socket.id);
	greenCircle.destroy();
	this.activarVelocidad() ;
       	this.llamarTextoSpeed(this);
       	this.textOnDestroy(this, greenCircle.x, greenCircle.y, '+speed', '10px', '#0000ff');
	console.log(`SPEED ACTIVATED.`);
	console.log(`type ='BLUE.`);

       	}
       	
       	//COLISION WITH PLAYER
       	if(greenCircle.type === 'player'){
	const localPlayer = players[socket.id];
	const otherPlayer = players[greenCircle.id];
	const localPuntos = localPlayer.puntos;
	const otherPuntos = otherPlayer.puntos;
	if(otherPuntos > localPuntos){
	localPlayer.destroyPlayer(socket.id);
	socket.emit('eliminarPlayer', socket.id);
	console.log(`type ='PLAYER.`);
	this.gameOver();
	}	    
	if(otherPuntos < localPuntos){
	this.textOnDestroy(this, greenCircle.x, greenCircle.y, otherPlayer.name +' eliminated!', '20px', '#ff0000');
	otherPlayer.destroyPlayer(greenCircle.id);
	}
	console.log(`COLISION WItH PLAYER`);
	console.log(`PLAYER `,greenCircle.id );	
       	}

	console.log(`ELIMINAR ESTE Z: `,greenCircle.z);
 
	 
} //END collectGreenCircle2
    
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
    
    //MOVER CAMARA A CENTRO CUANDO 30% y 70% LIMITE
moveCameraToCenter() {
        // Si ya está siguiendo la cámara, no hacer nada
        if (this.followingCamera) { return; }
        // Obtener las coordenadas del jugador
        const playerX = this.circle.x;
        const playerY = this.circle.y;
        // Usar un tween para mover la cámara suavemente hacia el jugador
        this.scene.tweens.add({
            targets: this.scene.cameras.main,
            scrollX: playerX - this.scene.scale.width / 2,
            scrollY: playerY - this.scene.scale.height / 2,
            duration: 1000, // Duración del tween en milisegundos
            ease: 'Power2',
            onComplete: () => { } });
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

///ANIMATE PLAYER MOVE // MOVE PLAYER FROM SERVER - ///ANIMATE PLAYER MOVE // MOVE PLAYER FROM SERVER - 

		
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

	
}  //END FUNCTION START GAME!!!!
