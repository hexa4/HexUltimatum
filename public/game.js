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
	let ZoomOut = 1;
	let noMover = false;
	let checkSecure = 0;
	let Cam = 1;
	const players = {}; // Usaremos un objeto para almacenar los jugadores
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

game.scene.start('UIScene');
game.scene.bringToTop('UIScene');
	
}
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


///GAMESCENE END !!!/!?!?!?!?!?!?!?!?!?!?	
///GAMESCENE END !!!/!?!?!?!?!?!?!?!?!?!?		
}  
	
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

/*			 
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
     
    	} else {
	
		
    	}
};
*/

			 

        } //END CREATE UISCENE
            
        update() {}
        preload() {
	}
         
}
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
