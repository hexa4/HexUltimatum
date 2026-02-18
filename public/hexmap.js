let hexagonSize = 50;
let hexagonWidth = hexagonSize * 2;
let hexagonHeight = Math.sqrt(3) * hexagonSize;
let hexagons = [];
let vertices = [];
        
const hexagonMap = [
        [{ direction: 'NE' }, { direction: 'E' }, { direction: 'SE' }, { direction: 'E' }],
        [{ direction: 'SW' }, { direction: 'ES' } ,{ direction: 'E' }, { direction: 'ES' }, { direction: 'E' }],
        [{ direction: 'SW' }, { direction: 'ES' }, { direction: 'E' }, { direction: 'ES' }, { direction: 'E' }]
];
    
