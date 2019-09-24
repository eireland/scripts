function selectTile(){
    let tiles = ['text','table','graph','image','draw']
    let random = Math.floor(Math.random() * Math.floor(tiles.length - 1))
    console.log('tile is: '+tiles[random])
    //return tiles[random];
}

let i=0;
for (i;i<3;i++) {
    selectTile()
}