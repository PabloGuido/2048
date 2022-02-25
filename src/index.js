import Phaser from 'phaser';
// import logoImg from './assets/base.png';

// cambiar el movimiento por tween
// poner css
// poner win y lose
// ver si es necsario flaggear mas los swipes [ok?]

let thisD
let rect_fisico
let casillas
let algo_se_movio = false
// -------------------------------
// Flechas
let arriba
let abajo
let izquierda
let derecha
let se_puede_mover = true
let pointer
let touchX
let touchY
// -------------------------------
// Tablero
let tablero = []
tablero[0] = [0,0,0,0]
tablero[1] = [0,0,0,0]
tablero[2] = [0,0,0,0]
tablero[3] = [0,0,0,0]

// Tablero delta
let tableroDelta = []
tableroDelta[0] = [0,0,0,0]
tableroDelta[1] = [0,0,0,0]
tableroDelta[2] = [0,0,0,0]
tableroDelta[3] = [0,0,0,0]


let tabla_casillas_vacias = []
let tabla_visaul = []

let volver_scala_1
let base
let t2048

// -------------------------------
let crear_numero_en_v
let crear_numero_en_h
let gameOver_contenedor
let score = 0
let score_txt
let high_score = 0
let high_score_txt
let set_high_score


// -------------------------------

let colores = []
colores[2] = 0xB4C778
colores[4] = 0x78C778
colores[8] = 0x78C7B4
colores[16] = 0x78B4C7
colores[32] = 0x7878C7
colores[64] = 0x9F78C7
colores[128] = 0xC778C7
colores[256] = 0xC7789F
colores[512] = 0xC77878
colores[1024] = 0xC79878
colores[2048] = 0xC7B478
colores[4096] = 0xC7C778

let casilla_numero = "casilla"
let gameOver = false
let gameWin = false
let gameWin_flag = false



class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image("casilla", "assets/casilla.png")
        this.load.image("casilla2", "assets/casilla2.png")
        this.load.image("casilla_s", "assets/casilla_s.png")
        this.load.image("base", "assets/base.png")
    }
      
    create ()
    {
        // game_over()
        high_score = localStorage.getItem("high_score");
        // console.log(load_high_score)
        thisD = this
        rect_fisico = this.physics.add.group();
        casillas = this.physics.add.group();

        base = this.add.image(400, 300, 'base');
        base.setTint(0x74719B);



        crear_rect_y_txt()

        // Activa las flechas del teclado
        arriba = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        abajo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        izquierda = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        derecha = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        pointer = this.input.activePointer;


        t2048 = thisD.add.text(400, 30, "2048", {fontSize: '32px', fill: "white", fontStyle: "bold"}).setOrigin(0.5, 0.5)
        t2048.setShadow(3, 3, 'rgba(1,0,1,1)', 2);

        thisD.add.text(680, 555, "Controls: ↑ ↓ ← → ", {fontSize: '22px', fill: "white"}).setOrigin(0.5, 0.5)
        thisD.add.text(680, 580, "or swipe.", {fontSize: '22px', fill: "white"}).setOrigin(0.5, 0.5)

        score_txt = thisD.add.text(0, 0, "Score: " + score, {fontSize: '30px', fill: "white"})
        high_score_txt = thisD.add.text(0, 26, "High score: " + high_score, {fontSize: '22px', fill: "white"})
        // console.log(tablero)

        let newGame_reset = thisD.add.image(700, 30, 'base');
        newGame_reset.scaleX = 0.4
        newGame_reset.scaleY = 0.085
        newGame_reset.setTint(0x74719B);
        newGame_reset.setInteractive();
        newGame_reset.on('pointerup', function() { 
            if (se_puede_mover === true){
                let volver_escala = function() {
                    newGame_reset.scaleX = 0.4
                    newGame_reset.scaleY = 0.085
                }
                thisD.tweens.add({
                targets: newGame_reset,
                scaleX: 0.45,
                scaleY: 0.095,
                ease: 'Power1',
                duration: 100,
                onComplete: volver_escala
                });
                restart_game();

            }
        });
        let newGame_reset_txt = thisD.add.text(700, 30, "New game", {fontSize: '30px', fill: "white"}).setOrigin(0.5, 0.5)

        this.input.on('pointerup', function(pointer){
            if (se_puede_mover === true)
            {
                if (pointer.upY < pointer.downY - 50){
                    // console.log("* swipe arriba *")
                    crear_numero_en_v = 3
                    crear_numero_en_h = "chequear"
                    registro(arriba)  
                    // return
                }
                else if (pointer.upY > pointer.downY + 50){
                    // console.log("* swipe abajo *")
                    crear_numero_en_v = 0
                    crear_numero_en_h = "chequear"
                    registro(abajo)
                    // return
                }
                else if (pointer.upX < pointer.downX - 50){
                    // console.log("* swipe izquierda *")
                    crear_numero_en_v = "chequear"
                    crear_numero_en_h = 3
                    registro(izquierda)
                    // return
                }
                else if (pointer.upX > pointer.downX + 50){
                    // console.log("* swipe derecha *")
                    crear_numero_en_v = "chequear"
                    crear_numero_en_h = 0
                    registro(derecha)  
                    // return
                }
            }

    });
        // game_over3()
        // console.log(tablero)
    }

    update ()
    {

        if (se_puede_mover === true)
        {
            if (Phaser.Input.Keyboard.JustDown(arriba))
            {
                // console.log("flecha arriba")
                crear_numero_en_v = 3
                crear_numero_en_h = "chequear"
                registro(arriba)    
                
            }
            else if (Phaser.Input.Keyboard.JustDown(abajo))
            {
                // console.log("flecha abajo")
                crear_numero_en_v = 0
                crear_numero_en_h = "chequear"
                registro(abajo)
            }
            else if (Phaser.Input.Keyboard.JustDown(izquierda))
            {
                // console.log("flecha izquierda")
                crear_numero_en_v = "chequear"
                crear_numero_en_h = 3
                registro(izquierda)
                
            }
            else if (Phaser.Input.Keyboard.JustDown(derecha))
            {    
                // console.log("flecha derecha")     
                crear_numero_en_v = "chequear"
                crear_numero_en_h = 0
                registro(derecha)                
            }            
        }

        if (gameOver === false){
            // chquear_distancias()    
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    mode: Phaser.Scale.FIT,
    // autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
    physics: {
            default: 'arcade',
            arcade: {
                // gravity: { y: 300 },
                debug: false
            }
        },
    scene: MyGame
};

const game = new Phaser.Game(config);

let crear_rect_y_txt = function() {
    let x = 234
    let y = 134

    let casilla = 0
    
        for (let k = 0; k < 4; k++)
        {
            for (let i = 0; i < 4; i++)
            {

            let r1 = casillas.create(x,y, "casilla_s")
            r1.game = null
            r1.setTint(0x494949)            

            tablero[k][i] = r1       
            // tablero.game = null
            x = x + 110
            casilla = casilla + 1
            }
        y = y + 110
        x = 234
        }
    

inicar_tablero()
}

let inicar_tablero = function () {
    // Inserta un "2" en las caillas inferios y superiores
    let suma = 0 
    for (let i = 0; i < 2; i = i + 1) {

        let fila = Math.floor(Math.random()*2 + suma)
        let casilla = Math.floor(Math.random()*4)

        let rect_nuevo = rect_fisico.create(0, 0, casilla_numero)
        rect_nuevo.valor = 2
        let ls = letra_size(rect_nuevo.valor)
        rect_nuevo.anim = false
        rect_nuevo.setTint(colores[rect_nuevo.valor])

        let rect_nuevo_t = thisD.add.text(0, 0, rect_nuevo.valor, {fontSize: ls, fill: "white", fontStyle: "bold"}).setOrigin(0.5, 0.5)
        rect_nuevo_t.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

        rect_nuevo.txt = rect_nuevo_t
        rect_nuevo.destino = null
        rect_nuevo.test = null
        let contenedor = thisD.add.container(tablero[fila][casilla].x, tablero[fila][casilla].y, [rect_nuevo, rect_nuevo_t])  
        thisD.physics.world.enableBody(contenedor);

        tablero[fila][casilla].game = contenedor
        suma = suma + 2

    };
    gameOver = false
    se_puede_mover = true

};

let letra_size = function (valor_n) {
    let size_n
    if (valor_n < 128)
    {
        size_n = "64px"
    }
    else if (valor_n > 127 && valor_n < 1024)
    {
        size_n = "52px"
    }
    else
    {
        size_n = "39px"
    }
    return size_n
}

let mover = function (sumaRestaH, sumaRestaV, h, v) 
{
    if (tablero[h][v].game != null) 
    {
        if (tablero[h + sumaRestaH][v + sumaRestaV].game === null)
        {
            tablero[h][v].game.list[0].destino = tablero[h + sumaRestaH][v + sumaRestaV]

            tablero[h + sumaRestaH][v + sumaRestaV].game = tablero[h][v].game            

            tablero[h][v].game = null
            algo_se_movio = true
            // console.log("b")

        }
    }
}

let crear_num = function(x, y, colorA, valor) {
    let rect_nuevoQ = rect_fisico.create(0, 0, casilla_numero)
    rect_nuevoQ.setTint( colorA )

    rect_nuevoQ.valor = valor
    let ls = letra_size(rect_nuevoQ.valor)
    let rect_nuevo_tQ = thisD.add.text(0, 0, rect_nuevoQ.valor, {fontSize: ls, fill: "white", fontStyle: "bold"}).setOrigin(0.5, 0.5)
    rect_nuevo_tQ.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    let contenedor = thisD.add.container(x, y, [rect_nuevoQ, rect_nuevo_tQ])
    return contenedor
}


let comparar = function (sumaRestaH, sumaRestaV, h, v) 
{
    if (tablero[h][v].game != null) 
    {
        if (tablero[h][v].game.list[0].valor === tablero[h + sumaRestaH][v + sumaRestaV].game.list[0].valor && tableroDelta[h][v] === 0)
        {

            
            tablero[h][v].game.list[0].valor = tablero[h][v].game.list[0].valor + tablero[h][v].game.list[0].valor
            score = score + tablero[h][v].game.list[0].valor


            score_txt.setText("Score: " + score);
            set_high_score()
            tablero[h][v].game.list[0].destino = tablero[h + sumaRestaH][v + sumaRestaV]


            tablero[h][v].game.list[0].test = tablero[h + sumaRestaH][v + sumaRestaV].game

            tablero[h + sumaRestaH][v + sumaRestaV].game = tablero[h][v].game
            tablero[h + sumaRestaH][v + sumaRestaV].game.anim = true
            tableroDelta[h][v] = 1 
            tableroDelta[h + sumaRestaH][v + sumaRestaV] = 1

            if (tablero[h + sumaRestaH][v + sumaRestaV].game.list[0].valor === 2048 && gameWin === false){
                gameWin = true
            }      



            // console.log(tablero[h][v].game.list[0].test)
            let valor_t = tablero[h][v].game.list[0].valor / 2
            let clr = colores[tablero[h][v].game.list[0].valor / 2]
            let new_rect = crear_num(tablero[h][v].game.list[0].test.x, tablero[h][v].game.list[0].test.y, clr, valor_t)
            tabla_visaul.push(new_rect)
            // console.log(tabla_visaul)


                    
            tablero[h][v].game.list[0].test.destroy();
            tablero[h][v].game.list[0].test = null
            tablero[h][v].game = null
            
            algo_se_movio = true
            // console.log("a")
        }                       
    }             
}

let registro = function (flecha) {
    var h
    var v
    var contador = 0
    se_puede_mover = false
    if (flecha === arriba)
    {
        // console.log("a")
        for (var scan = 0; scan < 3; scan = scan + 1) // Cuantas veces escanea = 3
        {
            // console.log(scan)
            for ( h = 1; h < 4; h = h + 1) // Los casilleros horizontales, ahora escanea de arriba hacia abajo.
            {
                if (h != 0)
                {
                    
                    for ( v = 0 ; v < 4; v = v + 1) // Los casilleros verticales, ahora escanea de izq hacia der.
                    {

                        mover(-1, 0, h, v) 
                        comparar(-1, 0, h, v) 
                          
                        if (scan === 2)
                        {
                            contador = contador + 1
                            // console.log("###" + contador)
                            if (contador === 12)
                            {
                                // En la ultima iteración de scan, al terminar restablece todos los casilleros de tableroDelta.
                                 // hacer animaciones?
                                animaciones()                                
                            }

                        }        
                    }                
                }
            }                
        }
    }


    if (flecha === abajo)
    {
        for (var scan = 0; scan < 3; scan = scan + 1) 
        {
            // console.log(scan)
            for ( h = 3; h > -1; h = h - 1)  // der to izq
            {
                if (h != 3)
                {
                    for ( v = 0 ; v < 4; v = v + 1)  // abajo to arriba
                    {
                        mover(1, 0, h, v) 
                        comparar(1, 0, h, v) 
                           
                        if (scan === 2)
                        {
                            contador = contador + 1
                            // console.log("###" + contador)
                            if (contador === 12)
                            {                                
                                animaciones()
                            }
                        }  
                    }       
                }
            }
        }

    }

    if (flecha === izquierda)
    {
        for (var scan = 0; scan < 3; scan = scan + 1) 
        {
            // console.log(scan)
            for ( v = 0; v < 4; v++ )  // arriba to abajo
            {
                // console.log(v)
                if (v != 0)
                {
                    for ( h = 0 ; h < 4; h = h + 1)  // izq to der
                    {
                        mover(0, -1, h, v) 
                        comparar(0, -1, h, v)
                        
                        if (scan === 2)
                        {
                            contador = contador + 1
                            // console.log("###" + contador)
                            if (contador === 12)
                            {                                
                                animaciones()
                            }
                        }   
                    }  
                                   
                }
            }
        }
    
    }

    if (flecha === derecha)
    {
        for (var scan = 0; scan < 3; scan = scan + 1) 
        {
            // console.log(scan)
            for ( v = 3; v > -1; v-- )  // abajo to arriba
            {
                // console.log(v)
                if (v != 3)
                {
                    for (h = 3; h > -1; h = h - 1) // der to izq
                    {
                        mover(0, 1, h, v) 
                        comparar(0, 1, h, v)                            
                        if (scan === 2)
                        {
                            contador = contador + 1
                            // console.log("###" + contador)
                            if (contador === 12)
                            {                                
                                animaciones()
                            }
                        }  
                    }                                         
                }
            }
        }
    
    }
    
    if (algo_se_movio === true)
    {

        // console.log("-------------------")
        // console.log(tablero[0])
        // console.log(tablero[1])
        // console.log(tablero[2])
        // console.log(tablero[3])            
        // console.log("-------------------")

        // setTimeout(function del(argument) {
        //     se_puede_mover = true
        // }, 310)   

        
        algo_se_movio = false

        setTimeout(function del2(argument) {
            for (let i = 0; i < tabla_visaul.length; i++)
            {
               tabla_visaul[i].destroy();
            }
        }, 40)

        setTimeout(crear_numero_nuevo, 300)

    }
    else
    {
        se_puede_mover = true
    }    
            
}

let modificar_valores = function (tween, targets, casillaM){

    if (casillaM.game != null && casillaM.game.list[0].destino != null && casillaM.game.list[0].destino != undefined)
    {  
        let qqq = casillaM.game.list[0].valor
        let ls = letra_size(qqq)

        console.log("modifica?")
        
        if (casillaM.game.anim === true)
            {
            casillaM.game.anim = false
            let volver_scala_1 = function ( trg) {

                casillaM.game.setScale(1)
                casillaM.game.list[1].setFontSize(ls);
                casillaM.game.list[1].setText(qqq);
                casillaM.game.list[0].setTint(colores[qqq])
                console.log("volver escala 1")

            }

            thisD.tweens.add({
                    targets: casillaM.game,
                    scale: 1.1,
                    ease: 'Power1',
                    duration: 25,
                    onComplete: volver_scala_1,
                    // onCompleteParams: [casillaM.game]
                    
            });
        }
    }
}

let animaciones = function () {
    for (let k = 0; k < 4; k++)
        {
            for (let v = 0; v < 4; v++)
            {
                if (tablero[k][v].game != null && tablero[k][v].game.list[0].destino != null)
                {   
                    // console.log("animaciones")
                    thisD.tweens.add({
                        targets: tablero[k][v].game,
                        x: tablero[k][v].game.list[0].destino.x,
                        y: tablero[k][v].game.list[0].destino.y,
                        ease: 'Power1',
                        duration: 150,
                        onComplete : modificar_valores,
                        onCompleteParams:[tablero[k][v]] 

                    });
                }
            }
        }
}


let restaurar_tableroDelta = function () {
    tableroDelta[0] = [0,0,0,0]
    tableroDelta[1] = [0,0,0,0]
    tableroDelta[2] = [0,0,0,0]
    tableroDelta[3] = [0,0,0,0]    
}


let chquear_distancias = function()
{
    for (let k = 0; k < 4; k++)
    {
        for (let v = 0; v < 4; v++)
        {

        if (tablero[k][v].game != null && tablero[k][v].game.list[0].destino != null && tablero[k][v].game.list[0].destino != undefined)
        {           
            
            let distance = Phaser.Math.Distance.Between(tablero[k][v].game.x, tablero[k][v].game.y, tablero[k][v].game.list[0].destino.x, tablero[k][v].game.list[0].destino.y);

            if (tablero[k][v].game.body.speed > 0)
                {
                    if (distance < 25)
                    {
                        tablero[k][v].game.body.reset(tablero[k][v].game.list[0].destino.x, tablero[k][v].game.list[0].destino.y);
                        
                        // tablero[k][v].game.list[1].setText(tablero[k][v].game.list[0].valor);
                        let qqq = tablero[k][v].game.list[0].valor
                        let ls = letra_size(qqq)

                        tablero[k][v].game.list[1].setFontSize(ls);
                        tablero[k][v].game.list[1].setText(qqq);
                        tablero[k][v].game.list[0].setTint(colores[qqq])
                        // 
                        if (tablero[k][v].game.anim === true)
                        {
                            tablero[k][v].game.anim = false
                            function volver_scala_1 (target) {
                                        target.setScale(1.125)

                                    }

                            thisD.tweens.add({
                                    targets: tablero[k][v].game,
                                    scale: 1,
                                    ease: 'Power1',
                                    duration: 100,
                                    onComplete: volver_scala_1(tablero[k][v].game)

                                });
                        }

                        if (tablero[k][v].game.list[0].test != null)
                        {


                        }                        
                    }
                }
            }
        }
    }
}

let crear_numero_nuevo = function () {

    restaurar_tableroDelta()

    if (crear_numero_en_h === "chequear")
    {
        for (let i = 0; i < 4; i++ )
        {
            if (tablero[crear_numero_en_v][i].game === null) 
            {
                tabla_casillas_vacias.push(i)
            }                
        }
    let multiplicador = tabla_casillas_vacias.length

    crear_numero_en_h = tabla_casillas_vacias[Math.floor(Math.random()*multiplicador)]
    }

    else if (crear_numero_en_v === "chequear")
    {
        for (let i = 0; i < 4; i++ )
        {
            if (tablero[i][crear_numero_en_h].game === null) 
            {
                tabla_casillas_vacias.push(i)
            }
        }
    let multiplicador = tabla_casillas_vacias.length

    crear_numero_en_v = tabla_casillas_vacias[Math.floor(Math.random()*multiplicador)]

    }    

    let rect_nuevo = rect_fisico.create(0, 0, casilla_numero)
    


    rect_nuevo.valor = 2
    rect_nuevo.setTint(colores[rect_nuevo.valor] )
    let ls = letra_size(rect_nuevo.valor)
    let rect_nuevo_t = thisD.add.text(0, 0, rect_nuevo.valor, {fontSize: ls, fill: "white", fontStyle: "bold"}).setOrigin(0.5, 0.5)
    rect_nuevo_t.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    rect_nuevo.txt = rect_nuevo_t
    rect_nuevo.destino = null
    rect_nuevo.test = null
    rect_nuevo.anim = false
    let contenedor = thisD.add.container(tablero[crear_numero_en_v][crear_numero_en_h].x, tablero[crear_numero_en_v][crear_numero_en_h].y, [rect_nuevo, rect_nuevo_t])  
    thisD.physics.world.enableBody(contenedor);

    tablero[crear_numero_en_v][crear_numero_en_h].game = contenedor
    score = score + rect_nuevo.valor
    score_txt.setText("Score: " + score);
    set_high_score()

    tabla_casillas_vacias = []
    se_puede_mover = true
    if (gameWin === true && gameWin_flag === false){
        gameWin_flag = true
        win_2048()
    }
    
    game_over()

}

let game_over = function () {
    let quedan_espacios = 0
    for (let k = 0; k < 4; k++){
        
        for (let v = 0; v < 4; v++){
            // console.log(v)
            if (tablero[k][v].game !== null){
                // console.log(tablero[k][v])
                quedan_espacios = quedan_espacios +1

            }

        }
    }  
    // console.log(quedan_espacios)
    if (quedan_espacios === 16){
        console.log("chequear si se puede ganar.")
        game_over2()
    } 
}
// tablero[k][v].game.list[0].valor
let game_over2 = function() {
    for (let k = 0; k < 4; k++){
        
        for (let v = 0; v < 3; v++){
            if (tablero[k][v].game.list[0].valor === tablero[k][v + 1].game.list[0].valor){
                return
            }
        }
    }
    for (let a = 0; a < 4; a++){
            for (let b = 0; b < 3; b++){
            if (tablero[b][a].game.list[0].valor === tablero[b + 1][a].game.list[0].valor){
                return
            }
        }
    }
    console.log("game over definitivo.")
    game_over3()
}

let game_over3 = function(){
    gameOver = true
    cartel_game_over()
}

let cartel_game_over = function () {
    se_puede_mover = false
    let gameOver_box = thisD.add.image(0, 0, 'base');
    gameOver_box.scaleX = 0.75
    gameOver_box.scaleY = 0.43
    gameOver_box.alpha = 0.95
    let gameOver_box_t = thisD.add.text(0, -75, "Game Over", {fontSize: '36px', fill: "white", fontStyle: "bold"}).setOrigin(0.5, 0.5)
    let gameOver_score_t = thisD.add.text(0, -30, "Score: " + score, {fontSize: '32px', fill: "white", fontStyle: "bold"}).setOrigin(0.5, 0.5)
    let gameOver_newGame = thisD.add.image(0, 40, 'base');
    gameOver_newGame.setInteractive();
    gameOver_newGame.on('pointerup', function() { 
        // console.log('pointerup'); 
        gameOver_newGame.removeInteractive()
        gameOver_contenedor.destroy()
        
        restart_game();
    });
    
    gameOver_newGame.scaleX = 0.4
    gameOver_newGame.scaleY = 0.1
    gameOver_newGame.setTint(0x74719B);
    let gameOver_newGame_t = thisD.add.text(0, 40, "New game", {fontSize: '24px', fill: "white", fontStyle: "bold"}).setOrigin(0.5, 0.5)
    let gameOver_contenedor = thisD.add.container(400, 300, [gameOver_box, gameOver_box_t, gameOver_score_t,gameOver_newGame,gameOver_newGame_t])
    gameOver_contenedor.alpha = 0
    thisD.tweens.add({
    targets: gameOver_contenedor,
    alpha: { value: 1, duration: 1000, ease: 'Power1' },
    });

}

let restart_game = function () {
    score = 0;
    score_txt.setText("Score: " + score);
    restaurar_tableroDelta()
    tabla_casillas_vacias = []
    for (let k = 0; k < 4; k++)
    {
        for (let v = 0; v < 4; v++){
            if (tablero[k][v].game !== null){

            tablero[k][v].game.destroy();
            tablero[k][v].game = null
            // console.log(tablero[k][v])

            }
        }
    }
    inicar_tablero()
}

let win_2048 = function () {
    console.log("ganaste!")
    se_puede_mover = false
    gameWin = true
    let gameWin_box = thisD.add.image(0, 0, 'base');
    gameWin_box.scaleX = 0.75
    gameWin_box.scaleY = 0.43
    gameWin_box.alpha = 0.95
    let gameWin_box_t1 = thisD.add.text(0, -65, "Congratulations!", {fontSize: '32px', fill: "white", fontStyle: "bold"}).setOrigin(0.5, 0.5)
    let gameWin_box_t2 = thisD.add.text(0, -25, "You won.", {fontSize: '32px', fill: "white", fontStyle: "bold"}).setOrigin(0.5, 0.5)
    let gameWin_newGame = thisD.add.image(0, 40, 'base');
    gameWin_newGame.scaleX = 0.4
    gameWin_newGame.scaleY = 0.1
    gameWin_newGame.setTint(0x74719B);
    gameWin_newGame.setInteractive();
    gameWin_newGame.on('pointerup', function() { 
    gameWin_newGame.removeInteractive()
    gameWin_contenedor.destroy()
    se_puede_mover = true
    });

    let gameWin_newGame_t = thisD.add.text(0, 40, "Continue", {fontSize: '24px', fill: "white", fontStyle: "bold"}).setOrigin(0.5, 0.5)
    let gameWin_contenedor = thisD.add.container(400, 300, [gameWin_box, gameWin_box_t1, gameWin_box_t2, gameWin_newGame, gameWin_newGame_t])
}

set_high_score = function() {
    if (score > high_score){
        high_score = score
        high_score_txt.setText("High score: " + score)
        localStorage.setItem("high_score", JSON.stringify(high_score));
    }
}