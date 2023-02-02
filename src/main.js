//native prototypes. 
//for my sanity, i'm sure others will claim it's bad practice as it may create unwanted bugs, but those cases are not present here.
Array.prototype.loop = function(func) {
    for(let i = this.length; i--;) func(this[i], i, this)
}
Array.prototype.shuffle = function(){
    let i = this.length
    while(i > 0){
        let I = random(this.length) | 0
        i--
        [this[i], this[I]] = [this[I], this[i]]
    }
}

//modifications to the global collision object
col.pr = (p, r, m = 1) => p.x > (m ? (r.x - r.width / 2) : r.x) && p.x < (m ? (r.x + r.width / 2) : r.x + r.width) && p.y > (m ? (r.y - r.height / 2) : r.y) && p.y < (m ? (r.y + r.height / 2) : r.y + r.height)
col.pc = (p, c) => dist(p.x, p.y, c.x, c.y) <= c.size / 2

//all presets here
smooth() //enable anti-aliasin'
imageMode(1) //center images
ellipseMode(1) //center circlez
rectMode(1) //center rectanglez
textAlign(1, 1) //center text
textFont('Lato') //set the font
strokeJoin(ROUND) //round corners
strokeCap(ROUND) //round corners
    
//all event listeners here
//objects are faster as they only store the necessary keys.
const keys = {}, mouse = {}, SPACE = 32
//key event listeners
keyPressed = e => keys[e.key.toLowerCase()] = keys[e.keyCode] = true
keyReleased = e => (keys[e.key.toLowerCase()] = keys[e.keyCode] = false, keys.release[e.key.toLowerCase()] = keys.release[e.keyCode] = true)
//mouve event listeners
mousePressed = e => mouse[e.button] = true
mouseReleased = e => mouse[e.button] = false
mouseClicked = () => mouse.click = true
    
//all globals here
//global constants
const SIZE = 50
//global arrays
let dudez = [], blox = [], keyz = [], decor = [], arrowz = [], effex = [], choices = [], boxes = [], sparkz = [], spawnerz = []
//global variables
let scene = 'graphix load', town = !false, level = 0, score = 0
//all game data
const game = {
    //dor/key colors
    colorz: [
        {color: color(75, 125, 175), name: "blue"},
        {color: color(225, 225, 50), name: "yellow"},
        {color: color(75, 175, 75), name: "green"},
        {color: color(225, 75, 75), name: "red"},
        {color: color(225, 150, 50), name: "orange"},
        {color: color(245, 175, 150), name: "gray"}
    ],
    //enemy/weapon colors
    color: {
        lacuk: color(150, 225, 100),
        zaas: color(75, 125, 175),
        nife: color(125, 50, 125)
    },
    //enemy health
    enemy: {
        basic: 100,
        lacuk: 125,
        zaas: 150,
        nife: 200
    },
    //determine player level
    playerLevel (weaponz, val=false) {
        let weaponLevels = {}
        weaponz.forEach(weapon => {
            const weaponType = weapon instanceof Bow  ? 'bow' : weapon.attack.type
            const weaponLevel = (weaponType === 'bow' ? Object.keys(this.bow) : Object.keys(this.sword[weaponType])).indexOf(weaponType === 'bow' ? weapon.type : weapon.type[1])
            weaponLevels[weaponType] = weaponLevel
        })
        return val ? Object.values(weaponLevels).sort((a, b) => b - a)[0] : weaponLevels
    },
    //bow data
    bow: {
        basic: {
            damage: 10,
            reload: 50,
            speed: 10,
            desc: "driftwood",
            name: 'basic'
        },
        lacuk: {
            damage: 15,
            reload: 40,
            speed: 12,
            desc: "knight's bow",
            name: 'lacuk'
        },
        zaas: {
            damage: 20,
            reload: 32.5,
            speed: 15,
            desc: "famed bow",
            name: 'zaas'
        },
        nife: {
            damage: 25,
            reload: 25,
            speed: 20,
            desc: "bow of legendz",
            name: 'nife'
        },
    },
    //sword data
    sword: {
        thrust: {
            basic: {
                reach: 15,
                speed: 50,
                damage: 2,
                desc: "some knife",
                name: 'basic'
            },
            lacuk: {
                reach: 20,
                speed: 40,
                damage: 3,
                desc: "knight's sword",
                name: 'lacuk'
            },
            zaas: {
                reach: 32.5,
                speed: 32.5,
                damage: 5,
                desc: "famed sword",
                name: 'zaas'
            },
            nife: {
                reach: 40,
                speed: 25,
                damage: 8,
                desc: "sword of legendz",
                name: 'nife'
            },
        },
        slice: {
            basic: {
                reach: 5,
                speed: 50,
                damage: 4,
                desc: "some knife",
                name: 'basic'
            },
            lacuk: {
                reach: 8,
                speed: 40,
                damage: 6,
                desc: "knight's sword",
                name: 'lacuk'
            },
            zaas: {
                reach: 10,
                speed: 32.5,
                damage: 10,
                desc: "famed sword",
                name: 'zaas'
            },
            nife: {
                reach: 15,
                speed: 25,
                damage: 16,
                desc: "sword of legendz",
                name: 'nife'
            },
        },
        pos: {
            A: {
                x: 50,
                y: -8
            },
            B: {
                x: 40 - 8.5 + 70,
                y: -8
            },
            C: {
                x: 50 - 8.5 + 70,
                y: 0
            },
            D: {
                x: 40 - 8.5 + 70,
                y: 8
            },
            E: {
                x: 50,
                y: 8
            },
            F: {
                x: 50,
                y: 0
            },
            G: {
                x: 10, 
                y: 0
            }
        }
    },
    //floor data
    floor: {x: -650, y: -650},
    //level
    levelz: {
        //level data
        data: [
            {
                map: [
                    'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
                    'bp                             b',
                    'b                              b',
                    'b         bbbb    bbbb         b',
                    'b         b          b         b',
                    'b         b          b         b',
                    'b         b          b         b',
                    'b                              b',
                    'b              S               b',
                    'b                              b',
                    'b         b          b         b',
                    'b         b          b         b',
                    'b         b          b         b',
                    'b         bbbb    bbbb         b',
                    'b                              b',
                    'b                              b',
                    'b                              b',
                    'b                              b',
                    'b                              b',
                    'b                              b',
                    'b                              b',
                    'b                              b',
                    'b                              b',
                    'b                              b',
                    'b   bbbbbbbbbbbb   bb          b',
                    'b        S          bb         b',
                    'b                    bb        b',
                    'b   bbbbbbbbbbbb      bb       b',
                    'b        S             bb      b',
                    'b                       bb  S  b',
                    'b   bbbbbbbbbbbb       bb      b',
                    'b         S           bb       b',
                    'b                    bb        b',
                    'b   bbbbbbbbbbbb    bb         b',
                    'b                  bb          b',
                    'b                              b',
                    'b                              b',
                    'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
                ],
                spec: []
            },
            {
                map: [
                    'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
                    'b              0                b',
                    'b              s                b',
                    'b  bbbbbbdbbbbbbbbbbbbbbbbbbbb  b',
                    'b  b            b            b  b',
                    'b  b            b            b  b',
                    'b  b            b            b  b',
                    'b  b    s       b            b  b',
                    'b  b            b     B      d  b',
                    'b  b            b            b  b',
                    'b  b            b            b  b',
                    'b  b            b            b  b',
                    'b  b            b  B         b  b',
                    'b  b            b            b  b',
                    'b  b            b  2         b  b',
                    'b  b            b            b  b',
                    'b  b   B  1     b            b  b',
                    'b  bbbbbbbbbbbbbbbbbbbbbbbbbbb  b',
                    'b  b            b            b  b',
                    'b  b            b            b  b',
                    'b  b            b            b  b',
                    'b  b            b            b  b',
                    'b  b       B    b     t      b  b',
                    'b  b            b            b  b',
                    'b  b  t         b            b  b',
                    'b  b            b            b  b',
                    'b  b            b            b  b',
                    'b  d           3b     t      b  b',
                    'b  b            b            b  b',
                    'b  b            b            b  b',
                    'b  b            b            b  b',
                    'b  bbbbbbbbbbbbbbbbbbbbbbbdbbb  b',
                    'b                               b',
                    'b                p              b',
                    'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
                ],
                spec: [
                    'tile [825, 175] {12, 13}',
                    'rug_ornate [75, 375]',
                    'rug_ornate [75, 1325]',
                    'rug_ornate [1525, 375]',
                    'rug_ornate [1525, 1325]',
                    'rug_ornate [375, 75] {90}',
                    'rug_ornate [1225, 75] {90}',
                    'rug_ornate [375, 1625] {90}',
                    'rug_ornate [1225, 1625] {90}',
                    'couch [725, 325] {90}',
                    'couch [725, 675] {90}',
                    'ottoman [650, 325]',
                    'ottoman [650, 675]',
                    'rug [400, 500]',
                    'table [1125, 400] {90}',
                    'table [1125, 600] {90}',
                    'bed [225, 975]',
                    'bed [675, 925] {90}',
                    'bed [675, 1475] {90}',
                    'bedsideTable [300, 900]',
                    'bedsideTable [750, 1000] {90}',
                    'bedsideTable [750, 1400] {90}',
                    'rug [450, 1200]',
                    'counter [1025, 1025]',
                    'island [1100, 1100]',
                ]
            }
        ],
        //level creation
        create (level) {
            const map = this.data[level].map,
                  spec = this.data[level].spec
            blox = []
            dudez = []
            arrowz = []
            effex = []
            keyz = []
            choices = []
            spawnerz = []
            decor = []
            score = 0
            player.health = player.reset
            initializeGUI(player.inventory)
            let counter = 0
            //map here
            map.forEach((str, y) => {
                [...str].forEach((char, x) => {
                    const X = x * SIZE, Y = y * SIZE
                    switch(char){
                        case 'b':
                            blox.push(new Block(X, Y))
                        break
                        case 'B':
                        case 's':
                        case 't':
                            dudez.push(new Enemy(char.toLowerCase(), X, Y))
                        break
                        case 'p':
                            player.x = X
                            player.y = Y
                        break
                        case 'd':
                            blox.push(new Door(game.colorz[counter++].name, X, Y))
                        break
                        case 'S':
                            spawnerz.push(new Spawner(X, Y))
                        break
                        default:
                            (/\d/).test(char) && keyz.push(new Key(game.colorz[Number(char)], X, Y))
                    }
                })
            })
            //regex parser for spec here
            spec.forEach((str, i) => {
                let args = [], cache
                str.trim().split(' ').forEach((str, i) => {
                    switch(i){
                        case 0:
                            args.push(str)
                        break
                        case 1:
                        case 2:
                            cache = str.match(/\d{1,4}/g)
                            args.push(Number(cache[0]))
                        break
                        case 3:
                        case 4:
                            cache = str.match(/\d{1,4}/g)
                            args.push(Number(cache[0]))
                        break
                    }
                })
                decor.push(new Decor(...args))
            })
        }
    },
    //run this thin'
    run () {
        background(250)
        cam.update()
        cursor.type = 'aim'
        rectMode(1)
        pushMatrix()
            translate(-cam.x, -cam.y)
            imageMode(0)
            image(graphix.floor, this.floor.x, this.floor.y)
            imageMode(1)
            decor.forEach(d => d.all())
            effex.forEach(effect => effect.update())
            arrowz.loop((arrow, i) => arrow.x < cam.x - width * 1.5 || arrow.x > cam.x + width * 1.5 || arrow.y < cam.y - height * 1.5 || arrow.y > cam.y + height * 1.5 ? arrowz.splice(i, 1) : arrow.all())
            blox.forEach(block => block.all())
            spawnerz.forEach(spawner => spawner.run())
            keyz.forEach(key => key.draw())
            dudez.loop((dude, i) => dude.health <= 0 ? (Effex.create(25, dude), town && score++,dudez.splice(i, 1)) : dude.all())
            
            player.all()
            dudez.loop(dude => dude.collide())
            
        popMatrix()
        
        noStroke()
        fill(250, 100)
        textSize(20)
        text(fps.toFixed(1), width - ctx.measureText(fps.toFixed(1)).width / 2 - 3, height - 20 / 2)
        boxes.forEach(box => box.draw())
        boxes.forEach(box => box.type === 'weapon' && box.hover())
        cursor.draw()
    }
}

//all graphix here
//graphic functions here
function arrow (x, y, s, r, type) {
    const colour = game.color[type]
    let darkerShade
    if(colour) darkerShade = color(colour.match(/\d{1,3}/g).map((val, i) => i < 3 ? (val - 25) : val))
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        strokeWeight(4)
        strokeJoin(ROUND)
        stroke(!colour ? color(200, 150, 100) : colour)
        line(0, -10, 0, 10)
        stroke(!colour ? color(150) : darkerShade)
        line(0, 10, -5, 15)
        line(0, 10, 0, 17.5)
        line(0, 10, 5, 15)
        fill(!colour ? color(150) : darkerShade)
        beginShape()
            vertex(-5, -10)
            vertex(0, -17.5)
            vertex(5, -10)
        endShape(CLOSE)
    popMatrix()
}
function door (x, y, s, r, colour) {
    const darkerShade = color(colour.match(/\d{1,3}/g).map((val, i) => i < 3 ? (val - 25) : val))
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        noStroke()
        rectMode(1)
        fill(darkerShade)
        rect(0, 0, 50, 50)
        fill(colour)
        rect(0, 0, 42.5, 42.5)
        fill(0, 125)
        rect(-15, 0, 5, 15, 5)
        strokeWeight(3)
        stroke(245, 125)
        noFill()
        arc(7, 0, 20, 20, -30, 210)
        line(7, 2, 7, -10)
        line(11, -2, 11, -10)
        line(3, -2, 3, -10)
    popMatrix()
}
function key (x, y, s, r, colour) {
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        noFill()
        strokeWeight(4)
        stroke(colour)
        ellipse(0, -10, 10, 10)
        line(0, -5, 0, 8)
        line(0, 8, -5, 8)
        line(0, 3, -5, 3)
    popMatrix()
}
function bow (x, y, s, r, type, hand = false) {
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        noFill()
        strokeWeight(3)
        switch(type){
            case 'basic':
                stroke(200, 150, 100)
                curve(30, -30, 60, 0, 30, 30)
            break
            case 'lacuk':
                stroke(150, 225, 100)
                curve(30, -30, 60, 0, 30, 30)
                
                fill(0, 50)
                noStroke()
                ellipse(30, 30, 3, 3)
                ellipse(34, 26, 3, 3)
                ellipse(38, 21, 3, 3)
                ellipse(42, 14, 3, 3)
                ellipse(44.5, 0, 3, 3)
                ellipse(30, -30, 3, 3)
                ellipse(34, -26, 3, 3)
                ellipse(38, -21, 3, 3)
                ellipse(42, -14, 3, 3)
            break
            case 'zaas':
                stroke(75, 125, 175)
                curve(30, -30, 60, 0, 30, 30)
                stroke(0, 100)
                line(30, -30, 40, -18)
                line(30, 30, 40, 18)
                noStroke()
                fill(245)
                ellipse(35, 24, 3, 3)
                ellipse(35, -24, 3, 3)
            break
            //last one?
            case 'nife':
                stroke(125, 50, 125)
                curve(30, -30, 60, 0, 30, 30)
                line(32, -28, 28, -24)
                line(35, -24, 40, -25)
                line(38, -20, 32, -18)
                line(32, 28, 28, 24)
                line(35, 24, 40, 25)
                line(38, 20, 32, 18)
            break
        }
        if(hand) stroke(245, 200, 150, 100), fill(245, 200, 150), ellipse(45, 0, 12, 12)
    popMatrix()
}
function person (x, y, s, r, type) {
    const colour = game.color[type]
    const skin = type === 'player' ? color(245, 200, 150) : colour ? colour : color(245, 75, 25), eyes = type === 'player' ? color(50) : colour ? color(colour.match(/\d{1,3}/g).map((val, i) => i < 3 ? (val - 50) : val)) : color(100, 0, 0)
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        rectMode(1)
        strokeWeight(5)
        stroke(skin, 100)
        fill(skin)
        ellipse(0, 0, 50, 50)
        strokeWeight(3)
        stroke(eyes, 100)
        fill(eyes)
        rect(-10, 0, 7, 20, 5)
        rect(10, 0, 7, 20, 5)
        if(type === 'player') stroke(50, 75, 100, 100), fill(50, 75, 100), ellipse(0, -17.5, 5, 5)
    popMatrix()
}
function sword (x, y, s, r, type) {
    const colour = game.color[type]
    let shades = []
    colour && shades.push(color(colour.match(/\d{1,3}/g).map((val, i) => i < 3 ? (val - 25) : val)), color(colour.match(/\d{1,3}/g).map((val, i) => i < 3 ? (val - (-20)) : val)), color(colour.match(/\d{1,3}/g).map((val, i) => i < 3 ? (val - (-5)) : val)))
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        noStroke()
        !colour ? fill(225, 100, 50) : fill(colour)
        beginShape()
            vertex(-5, 10)
            vertex(-5, 20)
            bezierVertex(-5, 40, 5, 40, 5, 20)
            vertex(5, 10)
        endShape()
        !colour ? stroke(255, 125, 75) : stroke(shades[0])
        strokeWeight(3)
        line(-10, 10, 10, 10)
        noStroke()
        !colour ? fill(200) : fill(shades[2])
        beginShape()
            vertex(8, 8.5)
            vertex(8, -40)
            vertex(0, -50)
            vertex(0, 8.5)
        endShape()
        !colour ? fill(175) : fill(shades[1])
        beginShape()
            vertex(-8, 8.5)
            vertex(-8, -40)
            vertex(0, -50)
            vertex(0, 8.5)
        endShape()
        !colour ? stroke(175) : stroke(shades[1])
        strokeWeight(0.01)
        line(0, -50, 0, 8.5)
        switch(type){
            case 'lacuk':
                noStroke()
                fill(0, 75)
                ellipse(0, 0, 5, 5)
                ellipse(0, -10, 5, 5)
                ellipse(0, -20, 5, 5)
                ellipse(0, -30, 5, 5)
            break
            case 'zaas':
                stroke(250, 50)
                strokeWeight(3)
                fill(250, 100)
                beginShape()
                vertex(0, -10)
                vertex(-5, -15)
                vertex(0, -20)
                vertex(5, -15)
                endShape(CLOSE)
            break
            case 'nife':
                strokeWeight(2)
                stroke(125, 225, 125, 100)
                fill(125, 225, 125)
                beginShape()
                    vertex(0, -5)
                    vertex(-4, -8)
                    vertex(-4, -22)
                    vertex(-0, -25)
                endShape()
                stroke(100, 200, 100, 100)
                fill(100, 200, 100)
                beginShape()
                    vertex(0, -5)
                    vertex(4, -8)
                    vertex(4, -22)
                    vertex(-0, -25)
                endShape()
                strokeWeight(3)
                stroke(0, 100)
                line(-4, 0, 4, 0)
                line(-4, -30, 4, -30)
            break
        }
    popMatrix()
}
function wall (x, y, s, r) {
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        noStroke()
        fill(200)
        rectMode(1)
        rect(0, 0, 51, 51)
        rectMode(0)
        pushMatrix()
            translate(-25, -25)
            strokeWeight(1)
            stroke(200)
            for(let i = 5; i--;){
                for(let l = !(i & 1) ? 3 : 4, j = l; j--;){
                    l === 4 && (j < 1 || j > 2) ? fill(75, 75, 75) : fill(75, 75, random(75, 100))
                    rect(l < 4 ? j * 50 / 3 : j * 50 / 3 - 50 / 6, i * 10, 50 / 3, 10, 1)
                }
            }
        popMatrix()
        rectMode(1)
    popMatrix()
}
function table (x, y, s, r) {
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        strokeWeight(2)
        stroke(150, 100, 75)
        fill(75, 25, 0)
        beginShape()
            vertex(-100, -50)
            vertex(-100, -25)
            bezierVertex(-50, -10, 50, -35, 100, -25)
            vertex(100, -50)
        endShape(CLOSE)
        fill(100, 50, 25)
        beginShape()
            vertex(-100, -25)
            bezierVertex(-50, -10, 50, -35, 100, -25)
            vertex(100, 25)
            bezierVertex(50, 10, -50, 35, -100, 25)
        endShape(CLOSE)
        fill(75, 25, 0)
        beginShape()
            vertex(-100, 50)
            vertex(-100, 25)
            bezierVertex(-50, 35, 50, 10, 100, 25)
            vertex(100, 50)
        endShape()
    popMatrix()
}
function couch (x, y, s, r) {
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        noStroke() //may need this
        stroke(0, 30)
        strokeWeight(2)
        fill(200)
        rectMode(1)
        beginShape()
            vertex(-150, 50)
            vertex(-120, 50)
            vertex(-120, -25)
            vertex(-150, -50)
        endShape(CLOSE)
        beginShape()
            vertex(-150, -50)
            vertex(150, -50)
            vertex(120, -25)
            vertex(-120, -25)
        endShape(CLOSE)
        beginShape()
            vertex(150, -50)
            vertex(150, 50)
            vertex(120, 50)
            vertex(120, -25)
        endShape(CLOSE)
        rect(0, 12.5, 240, 75)
        line(-50, -25, -50, 50)
        line(50, -25, 50, 50)
        rect(-85, -25, 70, 20, 10)
        rect(0, -25, 100, 20, 10)
        rect(85, -25, 70, 20, 10)
    popMatrix()
}
function ottoman (x, y, s, r) {
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        rectMode(1)
        strokeWeight(2)
        stroke(150)
        fill(200)
        ellipse(0, 0, 50, 50)
    popMatrix()
}
function counter (x, y, s, r) {
    //don't forget sink an' stove
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        rectMode(1)
        strokeWeight(2)
        stroke(245, 100)
        fill(245)
        beginShape()
            vertex(-200, -150)
            vertex(-200, 150)
            vertex(-100, 150)
            vertex(-100, -50)
            vertex(200, -50)
            vertex(200, -150)
        endShape(CLOSE)
        //stove
        stroke(25, 100)
        fill(25)
        rect(-150, 50, 75, 75, 5)
        noFill()
        stroke(245, 100)
        ellipse(-150, 50, 50, 50)
        stroke(245, 50, 50, 100)
        strokeWeight(1)
        for(let i = 8; i--;){
            ellipse(-150, 50, i * 5 + 5, i * 5 + 5)
        }
        //sink
        strokeWeight(2)
        stroke(100, 100)
        fill(150)
        rect(50, -100, 75, 75, 5)
        stroke(175, 100)
        fill(175)
        ellipse(50, -100, 4, 4)
        rectMode(0)
        rect(45, -137.5, 10, 30, 3)
        rectMode(1)
    popMatrix()
}
function island (x, y, s, r) {
    //nothin' on it
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        rectMode(1)
        strokeWeight(2)
        stroke(245, 100)
        fill(245)
        rect(0, 0, 150, 75)
    popMatrix()
}
function lampstand (x, y, s, r) {
    //i think this'll work
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        strokeWeight(2)
        for(let i = 42; i--;){
            stroke(245, 245, 100, 255 - i * (255 / 50))
            ellipse(0, 0, i + 20, i + 20)
        }
        strokeWeight(3)
        stroke(175, 175, 75)
        fill(200, 200, 100)
        ellipse(0, 0, 50, 50)
        fill(245, 245, 100)
        ellipse(0, 0, 30, 30)
        noStroke()
    popMatrix()
}
function bed (x, y, s, r) {
    //nice pillow
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        noStroke()
        rectMode(1)
        fill(100, 150, 200)
        rect(0, 0, 100, 200, 5)
        fill(75, 125, 175)
        rect(0, -80, 99, 40, 5)
        fill(125, 175, 225)
        rect(0, -55, 99, 20, 0)
        //pillow, soft pillow. makes me want to go to bed.
        strokeWeight(2)
        stroke(225)
        fill(250)
        const w = 75, h = 40, W = w / 2, H = h / 2 - 70
        beginShape()
            vertex(-W + 3, H)
            curveVertex(-W - 3, H + 3, -W, H - 3)
            vertex(-W, H - h + 3)
            curveVertex(-W - 3, H - h - 3, -W + 3, H - h)
            vertex(W - 3, H - h)
            curveVertex(W + 3, H - h - 3, W, H - h + 3)
            vertex(W, H - 3)
            curveVertex(W + 3, H + 3, W - 3, H)
        endShape(CLOSE)
    popMatrix()
}
function bedsideTable (x, y, s, r) {
    //just has a book
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        rectMode(1)
        strokeWeight(2)
        stroke(75, 30, 0, 100)
        fill(75, 30, 0)
        rect(0, 0, 50, 50, 2)
        pushMatrix()
            rotate(-30)
            noStroke()
            fill(245, 240, 200)
            rect(-10, 0, 20, 20, 2)
            rect(10, 0, 20, 20, 2)
            stroke(0, 100)
            line(0, -10, 0, 10)
            for(let i = 3; i--;){
                line(-15, i * 5 - 5, -5, i * 5 - 5)
                line(15, i * 5 - 5, 5, i * 5 - 5)
            }
        popMatrix()
    popMatrix()
}
//live i would think
function rug (x, y, s, r, ornate = false) {
    //ornate has some decor on the border
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        rectMode(1)
        strokeWeight(3)
        stroke(75, 150, 75, 100)
        fill(75, 150, 75)
        rect(0, 0, 100, 500, 3)
        if(!ornate){
            noStroke()
            fill(0, 50)
            for(let i = 5; i--;){
                rect(0, i * 100 - 200, 100, 50)
            }
        }
        noFill()
        stroke(255, 215, 0)
        rect(0, 0, 90, 490)
        if (ornate) {
            for(let i = 24; i--;){
                arc(-43, i * 20 - 230, 10, 10, -90, 90)
                arc(43, i * 20 - 230, 10, 10, 90, 270)
            }
            for(let i = 4; i--;){
                arc(i * 20 - 30, -243, 10, 10, 0, 180)
                arc(i * 20 - 30, 243, 10, 10, -180, 0)
            }
            stroke(255, 215, 0, 100)
            line(-25, -200, -25, 200)
            line(25, -200, 25, 200)
            stroke(255, 215, 0, 200)
            line(0, -210, 0, 210)
        }
    popMatrix()
}
//yuck
function floor (x, y, w, h) {
    pushMatrix()
        translate(x, y)
        rectMode(0)
        strokeWeight(2)
        stroke(73, 21, 0)
        fill(93, 41, 6)
        for(let y = h; y--;){
            for(let x = w; x--;){
                rect(x * 100 - (!(y & 1) ? 50 : 0), y * 15, 100, 15)
            }
        }
    popMatrix()
}
//drawn live
function tile (x, y, w, h) {
    pushMatrix()
        translate(x, y)
        rectMode(0)
        noStroke()
        for(let y = h; y--;){
            for(let x = w; x--;){
                fill(!((x + y) & 1) ? color(0, 25, 50) : color(255))
                rect(x * 50, y * 50, 50, 50)
            }
        }
    popMatrix()
}
//graphix object that stores images
const graphix = {
    player () {
        person(30, 30, 1, 0, 'player')
        return get(0, 0, 60, 60)
    },
    wall () {
        wall(25, 26, 1, 0)
        return get(0, 0, 51, 51)
    },
    table () {
        table(101, 51, 1, 0)
        return get(0, 0, 202, 102)
    },
    couch () {
        couch(150, 50, 1, 0)
        return get(0, 0, 300, 100)
    },
    ottoman () {
        ottoman(25, 25, 1, 0)
        return get(0, 0, 50, 50)
    },
    counter () {
        counter(200, 150, 1, 0)
        return get(0, 0, 400, 300)
    },
    island () {
        island(75, 37.5, 1, 0)
        return get(0, 0, 150, 75)
    },
    lampstand () {
        lampstand(35, 35, 1, 0)
        return get(0, 0, 70, 70)
    },
    bed () {
        bed(50, 100, 1, 0)
        return get(0, 0, 100, 200)
    },
    bedsideTable () {
        bedsideTable(25, 25, 1, 0)
        return get(0, 0, 50, 50)
    },
    rug () {
        rug(50, 250, 1, 0)
        return get(0, 0, 100, 500)
    },
    rug_ornate () {
        rug(50, 250, 1, 0, true) //set ornate to true
        return get(0, 0, 100, 500)
    },
    floor () {
        const w = 30, h = 200
        set(w * 100, h * 15)
        floor(0, 0, w, h)
        const result = canvas
        set(document.getElementsByTagName('canvas')[0])
        return result
    },
}

//adds all doors/keys/weaponz/enemies
game.colorz.forEach(colour => {
    graphix[`door_${colour.name}`] = () => {
        door(25, 25, 1, 0, colour.color)
        return get(0, 0, 50, 50)
    }
    graphix[`key_${colour.name}`] = () => {
        key(12.5, 20, 1, 0, colour.color)
        return get(0, 0, 25, 35)
    }
})

for (let key in game.bow) {
    graphix[`bow_${key}`] = () => {
        bow(-20, 40, 1, 0, key)
        return get(0, 0, 40, 80)
    }
    graphix[`arrow_${key}`] = () => {
        arrow(10, 25, 1, 0, key)
        return get(0, 0, 20, 50)
    }
    graphix[`sword_${key}`] = () => {
        sword(40, 20, 1, 90, key)
        return get(0, 0, 95, 40)
    }
    graphix[`enemy_${key}`] = () => {
        person(30, 30, 1, 0, key)
        return get(0, 0, 60, 60)
    }
}

let img_index = 0 //index in the array of keys in graphix
//loads images
const load = (obj, next='menu') => {
    //create an array of the keys in obj
    //a is the key in {a: 1}
    const keys = Object.keys(obj)
    //operator overload, >:)
    
    //first we call clear, then we use + to have JS
    //continue to run the next function
    clear() + 
    //next we set the property in img to the image
    //rather than the function. this if followed
    //by - to continue our operator overloadin'
    (obj[keys[img_index]] = obj[keys[img_index]]()) - 
    //lastly, we continue to loop through imgs or
    //head to the next scene.
    (++img_index >= keys.length && (scene = next))
}

//all logic here

/*
should the bow draw back?
ngl, not sure, but willin' to do anythin' to
juice this up.
*/
class Bow {
    //constructs the bow
    constructor(...args){
        //should just be this.type once i get more done so it references the game data object for all necessary specs
        [this.type, this.player] = args
        this.data = game.bow[this.type]
        this.timer = this.data.reload
        //as in you *draw* a bow
        this.draw = {
            //if bow is bein' drawn
            bool: false,
            //amount bow is bein' drawn
            val: 0,
            //max stretch of drawn bow
            max: 30,
            //if the bow has reached its max
            reach: false,
            arrow: 50
        }
    }
    //runs the bow
    run (...args) {
        [this.x, this.y, this.ang] = args
        const colour = this.player ? color(245, 200, 150) : game.color[this.type] ? game.color[this.type] : color(245, 75, 25)
        //display
        pushMatrix()
            translate(this.x, this.y)
            rotate(this.ang)
            noFill()
            stroke(150)
            strokeWeight(3)
            curve(30, -30, 30 - this.draw.val, 0, 30, 30)
            image(graphix[`bow_${this.type}`], 40, 0)
            strokeWeight(3)
            stroke(colour, 100)
            fill(colour)
            ellipse(45, 0, 12, 12)
            ellipse(30 - this.draw.val / 2, 0, 12, 12)
        //animation
        if(this.draw.bool){
            pushMatrix()
                translate(this.draw.arrow, 0)
                rotate(90)
                scale(0.75)
                image(graphix[`arrow_${this.type}`], 0, 0)
            popMatrix()
            this.draw.val = lerp(this.draw.val, this.draw.max, 60 / (this.timer * 10))
            this.draw.arrow = lerp(this.draw.arrow, 30, 60 / (this.timer * 10))
            this.draw.val > this.draw.max - 1 && (this.player ? !mouse[0] : true) && (this.draw.reach = true, this.draw.arrow = 50, this.draw.bool = false)
        }
        else this.draw.val = lerp(this.draw.val, 0, 60 / (this.timer * 10))
        this.draw.val = constrain(this.draw.val, 0, this.draw.max)
        popMatrix()
    }
    //returns the genre of weapon
    genre () {
        return {type: "bow", name: this.type}
    }
}

//melee isn't easy; i think.
//eh, not terrible
class Sword {
    //construct sword
    constructor (...args) {
        [this.type, this.player] = args
        this.type = this.type.split('.')
        this.data = game.sword[this.type[0] === 't' ? 'thrust' : 'slice'][this.type[1]]
        this.pos = {
            a: {x: 0, y: 0},
            b: {x: 0, y: 0},
            c: {x: 0, y: 0},
            d: {x: 0, y: 0},
            e: {x: 0, y: 0},
            f: {x: 0, y: 0},
            g: {x: 0, y: 0},
            ...game.sword.pos
        }
        this.damage = this.data.damage
        this.reach = this.data.reach
        this.timer = this.data.speed
        this.attack = {
            type: this.type[0] === 't' ? 'thrust' : 'slice',
            bool: false,
            ready: false,
            ang: 0,
            thrust: 1
        }
    }
    //rotate points given a key for pos object
    rotate (key) {
        key = key.toLowerCase()
        const point = this.pos[key], pos = this.pos[key.toUpperCase()]
        const c = cos(-this.ang - this.attack.ang), s = sin(-this.ang - this.attack.ang)
        this.pos[key].x = (c * pos.x) + (s * pos.y) + this.x + cos(this.ang) * this.attack.thrust
        this.pos[key].y = (c * pos.y) - (s * pos.x) + this.y + sin(this.ang) * this.attack.thrust
    }
    //update position of the sword
    updatePosition () {
        for(let key in this.pos) key === key.toLowerCase() && this.rotate(key)
    }
    //check if the sword is in a wall
    inWall () {
        let cache = false
        blox.forEach(block => {
            ['a', 'b', 'c', 'd', 'e', 'f', 'g'].forEach(char => {
                const c = block instanceof Door ? col.pr(this.pos[char], {x: block.x - block.width / 2, y: block.y - block.height / 2, width: block.w, height: block.height}, 0) : col.pr(this.pos[char], block)
                if(c) cache = true
            })
        })
        return cache
    }
    //draw the sword
    draw () {
        const colour = this.player ? color(245, 200, 150) : game.color[this.type[1]] ? game.color[this.type[1]] : color(245, 75, 25)
        pushMatrix()
            translate(this.x + cos(this.ang) * this.attack.thrust, this.y + sin(this.ang) * this.attack.thrust)
            rotate(this.ang + this.attack.ang)
            image(graphix[`sword_${this.type[1]}`], 70, 0)
            strokeWeight(3)
            stroke(colour, 100)
            fill(colour)
            ellipse(35, 5, 12, 12)
            ellipse(45, -5, 12, 12)
        popMatrix()
    }
    //update the sword
    update () {
        if (this.attack.bool) {
            if(this.attack.type === 'thrust'){
                this.attack.thrust = lerp(this.attack.thrust, this.reach, 60 / (this.timer * 10))
                if(this.attack.thrust > this.reach - 1) this.attack.bool = false
            } 
            else {
                this.attack.thrust = lerp(this.attack.thrust, this.reach, 60 / (this.timer * 10))
                if (!this.attack.ready) {
                    this.attack.ang = lerp(this.attack.ang, -90, 60 / (this.timer * 10))
                    if(this.attack.ang < -89) this.attack.ready = true
                }
                else {
                    this.attack.ang = lerp(this.attack.ang, 90, 60 / (this.timer * 10))
                    if(this.attack.ang > 89) this.attack.bool = this.attack.ready = false
                }
            }
        }
        else {
            this.attack.ang = lerp(this.attack.ang, 0, (60 / (this.timer * 10)))
            this.attack.thrust = lerp(this.attack.thrust, 0, (60 / (this.timer * 10)))
        }
    }
    //determine the genre of the sword
    genre () {
        return {type: this.attack.type, name: this.type[1]}
    }
    //run all of the sword functionz
    all (...args) {
        [this.x, this.y, this.ang] = args
        this.updatePosition()
        this.draw()
        this.update()
    }
}

const player = {
    //data
    //position
    x: 50,
    y: 50,
    //velocity
    vel: {
        //x component of velocity vector
        x: 0,
        //y component of velocity vector
        y: 0,
        //max value of velocity component
        max: 5
    },
    //size
    size: 50,
    //acceleration
    acc: 0.25,
    //idk anymore
    reset: 100,
    //health
    health: 100,
    //angle
    ang: 0,
    inventory: {
        keyz: [],
        weaponz: [
            new Bow('basic', true),
            new Sword('t.basic', true),
            new Sword('s.basic', true)
        ]
    },
    //functionz [
    //draw the player
    draw () {
        pushMatrix()
            translate(this.x, this.y)
            rotate(this.ang - 90)
            noStroke()
            rectMode(1)
            fill(225, 125, 125)
            rect(0, -30, this.health / (this.reset / 50), 5, 5)
        //draws the player image where the player is
            image(graphix.player, 0, 0)
        popMatrix()
    },
    //moves the player with acceleration an' semi-realistic friction
    move () {
        if(keys[UP] || keys['w']) this.vel.y -= this.acc
        else if(keys[DOWN] || keys['s']) this.vel.y += this.acc
        else this.vel.y = lerp(this.vel.y, 0, 0.1)
        
        if(keys[LEFT] || keys['a']) this.vel.x -= this.acc
        else if(keys[RIGHT] || keys['d']) this.vel.x += this.acc
        else this.vel.x = lerp(this.vel.x, 0, 0.1)
        
        this.vel.x = constrain(this.vel.x, -this.vel.max, this.vel.max)
        this.vel.y = constrain(this.vel.y, -this.vel.max, this.vel.max)
        
        this.x += this.vel.x
        this.y += this.vel.y
    },
    //collisions
    collide () {
        //collide with blox
        blox.forEach(block => {
            if(!(block instanceof Door && block.opened)){
                //cache the resolution to conflict
                const cache = col.rcp(this, block)
                //if the resolution exists, apply it
                cache && ([this.x, this.y] = cache)
            }
        })
        
        //collide with arrowz
        arrowz.forEach((arrow, i) => 
            //if there is a collision
            col.cc(this, arrow) 
            //an' the player didn't shoot the arrow
            && arrow.archer !== 'player' 
            && (
                //particle effex
                Effex.create(10, arrow, color(50)),
                //splice the arrow
                arrowz.splice(i, 1), 
                //deal the appropriate 'mount of damage
                this.health -= game.bow[arrow.type].damage
            )
        )
        
        //collide with enemiez
        dudez.forEach((dude, i) => {
            const cache = col.ccp(this, dude, 50)
            cache && ([this.x, this.y] = cache)
            dudez.loop((d, j) => {
                if(i !== j){
                    let cache = col.ccp(dude, d, 50)
                    cache && ([dude.x, dude.y] = cache)
                }
            })
        })
        
        keyz.forEach((key, i) => col.cc(this, key, 70) && (keyz.splice(i, 1), this.inventory.keyz.push(key.colour), boxes.push(new Box(key.colour)), boxes.forEach(box => box.init())))
        decor.forEach(d => {
            let cache
            switch(d.type){
                case 'rect':
                    cache = col.rcp(this, d)
                break
                case 'circle':
                    cache = col.ccp(this, d, (d.size + this.size) / 2)
                break
                case 'counter':
                    d.rects.forEach(rect => {
                        const collision = col.rcp(this, rect)
                        collision && ([this.x, this.y] = collision)
                        
                    })
                break
            }
            cache && ([this.x, this.y] = cache)
        })
    },
    //use ranged attack
    shoot () {
        //draw the bow an' update position/animation
        this.bow.run(this.x, this.y, this.ang)
        
        //if the mouse is pressed
        mouse[0] 
        //an' the bow is ready to fire
        && this.bow.draw.val < 1 
        //draw the bow
        && (this.bow.draw.bool = true)
        
        //if the bow is fully drawn
        this.bow.draw.reach 
        && (
            //shoot an' arrow where the animated arrow is with the proper specs
            Arrow.create(this.bow.type, this.x + cos(this.ang) * 30, this.y + sin(this.ang) * 30, this.ang, true), 
            //set the bow to not drawn
            this.bow.draw.reach = false
        )
    },
    //use melee attack - add slice attack(?)
    melee () {
        //draw an' update the sword
        this.sword.all(this.x, this.y, this.ang)
        
        //if the mouse is pressed
        mouse[0] 
        //an' the sword can be thrusted
        && (this.sword.type[0] === 's' ? this.sword.attack.ang : this.sword.attack.thrust) < 1 
        //thrust the sword
        && (this.sword.attack.bool = true)
    },
    //update weapon/health stat - in dev
    switch () {
        let command, weaponz = this.inventory.weaponz, bow = weaponz.find(weapon => weapon instanceof Bow), thrust = weaponz.find(weapon => weapon instanceof Sword && weapon.attack.type === 'thrust'), slice = weaponz.find(weapon => weapon instanceof Sword && weapon.attack.type === 'slice')
        
        if(keys.release['1']) command = 'bow'
        else if(keys.release['2']) command = 'thrust'
        else if(keys.release['3']) command = 'slice'
        
        if(command === 'bow' && bow) this.sword = null, this.bow = bow
        else if(command === 'thrust' && thrust) this.bow = null, this.sword = thrust
        else if(command === 'slice' && slice) this.bow = null, this.sword = slice
    },
    add (weapon) {
        let weaponz = this.inventory.weaponz, bow, thrust, slice
        weaponz.forEach(weapon => {
            if(weapon instanceof Bow) bow = weapon
            else if(weapon.attack.type === 'thrust') thrust = weapon
            else slice = weapon
        })
        
        if(weapon instanceof Bow && bow) weaponz.splice(weaponz.indexOf(bow), 1, weapon)
        else if(weapon.attack.type === 'thrust' && thrust) weaponz.splice(weaponz.indexOf(thrust), 1, weapon)
        else if(slice) weaponz.splice(weaponz.indexOf(slice), 1, weapon)
    },
    //]
    //wrapper for all functionz
    all () {
        //update angle
        this.ang = atan2(cam.my - this.y, cam.mx - this.x)
        this.health = max(this.health, 0)
        //decide which attack to update
        this.bow ? this.shoot() : this.melee()
        //draw the player
        this.draw()
        //move the player
        this.move()
        //update player collisions
        this.collide()
        this.switch()
        
        /*
        //if the player is ded
        this.health <= 0 
        //um, well they're ded
        && (scene = 'ded')
        */
    }
}

//camera object
const cam = {
    x: 0,
    y: 0,
    mx: 0,
    my: 0,
    reset: {
        x: 0,
        y: 0
    },
    update () {
        cam.mx = cam.reset.x = cam.x = lerp(cam.x, player.x - width / 2, 0.1)
        cam.my = cam.reset.y = cam.y = lerp(cam.y, player.y - height / 2, 0.1)
        cam.my += mouseY
        cam.mx += mouseX
    },
    shake (intensity) {
        cam.mx = cam.reset.x = lerp(cam.x, player.x, 0.1)
        cam.my = cam.reset.y = lerp(cam.y, player.y, 0.1)
        cam.x = random(-intensity, intensity) + cam.reset.x
        cam.y = random(-intensity, intensity) + cam.reset.y
        cam.mx += mouseX
        cam.my += mouseY
    }
}

//enemy class
class Enemy {
    static sword (striker, oof) {
        const sword = striker.sword, pos = sword.pos
        let isColliding = false, inWall = false
        if(sword.attack.bool && dist(oof.x, oof.y, pos.c.x, pos.c.y) <= 100) {
            'abcdef'.split('').forEach(char => {
                inWall = inWall || sword.inWall()
                isColliding = isColliding || col.pc(pos[char], oof)
            })
            if(isColliding && !inWall){
                Effex.create(1, {x: oof.x, y: oof.y}, color(50))
                oof.health -= sword.damage
            } 
        }
    }
    constructor (attack, x, y, arena) {
        this.attack = attack
        this.x = x
        this.y = y
        this.size = 50
        this.speed = 3
        this.level = arena ? random(3) | 0 : game.playerLevel(player.inventory.weaponz, true)
        this.type = this.level > 2 ? 'nife' : this.level > 1 ? 'zaas' : this.level > 0 ? 'lacuk' : 'basic'
        this.max = this.health = game.enemy[this.type]
        this.attack === 'b' ? this.bow = new Bow(this.type) : this.sword = new Sword(`${this.attack}.${this.type}`)
        this.range = this.bow ? {
            in: 200,
            out: 300,
            is: false
        } : {
            in: player.size + this.sword.pos.F.x + (this.sword.type === 'thrust' ? 15 : 0),
            out: player.size + this.sword.pos.C.x + (this.sword.type === 'thrust' ? 15 : 0),
            is: false
        }
        this.dist = Infinity
    }
    draw () {
        pushMatrix()
        translate(this.x, this.y)
        rotate(this.ang - 90)
        rectMode(1)
        noStroke()
        fill(225, 125, 125)
        rect(0, -30, this.health / (this.max / 50), 5, 5)
        image(graphix[`enemy_${this.type}`], 0, 0)
        popMatrix()
    }
    move () {
        if(this.range.bool ? this.dist > this.range.out : this.dist > this.range.in){
            this.x += cos(this.ang) * this.speed
            this.y += sin(this.ang) * this.speed
        }
        if(this.dist <= this.range.in) this.range.bool = true
        if(this.range.bool && this.dist > this.range.out) this.range.bool = false
    }
    melee () {
        this.sword.all(this.x, this.y, this.ang)
        
        true &&
        //an' the sword can be thrusted
        (this.sword.type[0] === 's' ? this.sword.attack.ang : this.sword.attack.thrust) < 1 
        //thrust the sword
        && (this.sword.attack.bool = true)
    }
    shoot () {
        //draw the bow an' update position/animation
        this.bow.run(this.x, this.y, this.ang)
        
        //if the mouse is pressed
        true
        //an' the bow is ready to fire
        && this.bow.draw.val < 1 
        //draw the bow
        && (this.bow.draw.bool = true)
        
        //if the bow is fully drawn
        this.bow.draw.reach 
        && (
            //shoot an' arrow where the animated arrow is with the proper specs
            Arrow.create(this.bow.type, this.x + cos(this.ang) * 30, this.y + sin(this.ang) * 30, this.ang), 
            //set the bow to not drawn
            this.bow.draw.reach = false
        )
    }
    collide () {
        //collide with blox
        blox.forEach(block => {
            const cache = col.rcp(this, block)
            cache && ([this.x, this.y] = cache)
        })
        arrowz.forEach((arrow, i) => col.cc(this, arrow) && arrow.player && (Effex.create(10, arrow, color(50)), this.health -= arrow.damage, arrowz.splice(i, 1)))
        decor.forEach(d => {
            let cache
            switch(d.type){
                case 'rect':
                    cache = col.rcp(this, d)
                break
                case 'circle':
                    cache = col.ccp(this, d, (d.size + this.size) / 2)
                break
                case 'counter':
                    d.rects.forEach(rect => {
                        const collision = col.rcp(this, rect)
                        collision && ([this.x, this.y] = collision)
                        
                    })
                break
            }
            cache && ([this.x, this.y] = cache)
        })
        player.sword && Enemy.sword(player, this, true)
        this.sword && Enemy.sword(this, player)
    }
    all () {
        this.ang = atan2(player.y - this.y, player.x - this.x)
        this.dist = dist(this.x, this.y, player.x, player.y)
        this.bow ? this.shoot() : this.melee()
        this.draw()
        this.move()
        this.collide()
    }
}

//general obstacle class
class Obstacle {
    constructor (...args) {
        [this.x, this.y] = args
        this.width = this.height = SIZE
    }
    collide (CORNER) {
        arrowz.forEach((arrow, i) => (CORNER ? col.rc(arrow, {x: this.x - this.width / 2, y: this.y - this.height / 2, width: this.w, height: this.height}, 0) : col.rc(arrow, this)) && (Effex.create(10, arrow, color(100)), arrowz.splice(i, 1)))
    }
}

class Block extends Obstacle {
    constructor (...args) {
        super(...args)
    }
    draw () {
        image(graphix.wall, this.x, this.y)
    }
    all () {
        this.draw()
        this.collide()
    }
}

class Door extends Obstacle {
    constructor(colour, ...args){
        super(...args, true)
        this.color = colour
        this.opened =  false
        this.w = this.width
    }
    draw () {
        imageMode(0)
        image(graphix[`door_${this.color}`], this.x - this.width / 2 - 0.75, this.y - this.height / 2 - 0.75, this.w + 1.5, this.height + 2)
        imageMode(1)
    }
    update () {
        this.w = lerp(this.w, this.opened ? 0 : this.width, 0.075)
        if(col.rc(player, this) && keys[SPACE] && player.inventory.keyz.some(key => key.name === this.color)) this.opened = true
        //close door if it's open an' the player isn't nearby
        this.opened && dist(player.x, player.y, this.x, this.y) > 100 && (this.opened = false)
    }
    all () {
        this.draw()
        this.update()
        this.collide(true)
    }
}

class Spawner {
    constructor (...args) {
        [this.x, this.y] = args
        this.timer = 0
        this.reset = 1000
    }
    run () {
        if(this.timer-- <= 0) dudez.push(new Enemy(['b', 's', 't'][random(3) | 0], this.x, this.y, true)), this.timer = this.reset
    }
}

class Key {
    constructor (...args) {
        [this.colour, this.x, this.y] = args
    }
    draw () {
        image(graphix[`key_${this.colour.name}`], this.x, this.y)
    }
}

class Arrow {
    constructor (...args) {
        [this.type, this.x, this.y, this.ang, this.player] = args
        this.data = game.bow[this.type]
        this.speed = this.data.speed
        this.damage = this.data.damage
        this.size = 15
    }
    draw () {
        pushMatrix()
            translate(this.x, this.y)
            rotate(this.ang + 90)
            arrow(0, 0, 1, 0, this.type)
        popMatrix()
    }
    update () {
        this.x += cos(this.ang) * this.speed
        this.y += sin(this.ang) * this.speed
    }
    all () {
        this.draw()
        this.update()
    }
    //for easier creation
    static create(...args) {
        arrowz.push(new Arrow(...args))
    }
}

class Decor {
    constructor (...args) {
        [this.name, this.x, this.y, this.spec, this.h] = args
        this.image = graphix[this.name]
        switch(this.name){
            case 'couch':
            case 'table':
            case 'island':
            case 'bed':
            case 'bedsideTable':
                this.type = 'rect'
                if(this.spec === 90 || this.spec === 270) this.width = this.image.height, this.height = this.image.width
                else this.width = this.image.width, this.height = this.image.height
            break
            case 'lampstand':
            case 'ottoman':
                this.type = 'circle'
                this.size = this.image.width - (this.name === 'lampstand' ? 7 : 0)
            break
            case 'counter':
                this.type = this.name
                this.rects = [{x: this.x - 150, y: this.y, width: 100, height: 300}, {x: this.x, y: this.y - 100, width: 400, height: 100}]
            break
            case 'tile':
                this.type = ''
                this.w = this.spec
            default:
                this.type = ''
        }
    }
    draw () {
        if(this.name === 'tile'){
            tile(this.x, this.y, this.w, this.h)
        }
        else {
            pushMatrix()
                translate(this.x, this.y)
                this.spec && rotate(this.spec)
                image(graphix[this.name], 0, 0)
            popMatrix()
        }
    }
    isColliding (c) {
        switch(this.type){
            case 'rect':
                return col.rc(c, this)
            break
            case 'circle':
                return col.cc(c, this)
            break
            case 'counter':
                let bool = false
                this.rects.forEach(rect => {
                    if (col.rc(c, rect)) bool = true
                })
                return bool
            default:
                return
        }
    }
    collide () {
        arrowz.loop((arrow, i) => this.isColliding(arrow) && (Effex.create(10, arrow, color(100)), arrowz.splice(i, 1)))
    }
    all () {
        this.draw()
        this.collide()
    }
}

//this might be one of the crazier classes
//the effex class creates a particle effect
class Effex {
    constructor (
        //number of particles to spawn
        n, 
        //object with x an' y values
        obj, 
        //self-explanatory
        col = color(0), shape = "circle", size = 10, speed = 3, 
        //fade speed
        fade = 0.05
    ) {
        //attach arguments to the instance
        this.x = obj.x
        this.y = obj.y
        this.color = col
        this.shape = shape
        this.size = size
        this.speed = speed
        this.fade = fade
        
        //create an array to store all of the particles
        this.particlez = []
        
        //create the particles based on argument n
        for(let i = n; i--;){
            //push the particles to the array
            this.particlez.push({
                //self-explanatory
                x: this.x,
                y: this.y,
                alpha: 255,
                ang: random(360),
                rot: random(360),
                size: this.size,
                //here's smth different
                /*
                instead of the normal method of 
                runnin' all of the code within
                the for loop directly [which may
                be more efficient in a sense];
                the coder sacrifices readability
                to a preposterous degree.
                
                i have decided to combine
                readability an' ES6+ syntax
                [notice no colon when definin'
                the functionz below]
                to create a more suitable
                particle system
                */
                //draw the particle based on given specifications
                draw (spec) {
                    //keep the transformations within the particle drawin'
                    pushMatrix()
                        translate(this.x, this.y)
                        //rotate particle if the particle is a rectangle
                        spec.shape === 'rect' && rotate(this.rot)
                        noStroke()
                        //color the particle
                        fill(spec.color, this.alpha)
                        //draw the particle based on the shape defined in the construction of the instance of Effex usin' bracket notation to access the object
                        window[spec.shape === 'rect' ? 'rect' : 'ellipse'](0, 0, this.size, this.size)
                    popMatrix()
                },
                //update the particle based on given specifications
                update (spec) {
                    //update position
                    this.x += cos(this.ang) * spec.speed
                    this.y += sin(this.ang) * spec.speed
                    //update size, rotation angle, an' opacity
                    this.size = lerp(this.size, 0, spec.fade)
                    this.rot += 5
                    this.alpha = lerp(this.alpha, 0, spec.fade)
                    //return true if the particle is inivisible [not 0 since lerp never* reaches 0]
                    return this.alpha < 1 || this.size < 1
                    //*at some point lerp will reach 0 [as computers can't hold numbers that go on for infinite decimal places] but performance would drop like a rock if i did so
                }
            })
        }
    }
    //update the effect
    update () {
        //cache array for increased performance
        const arr = this.particlez
        //loop through every item in the array
        this.particlez.loop((particle, i) => 
            //draw particle, then update particle.
            //if particle is invisible, delete it.
            particle.draw(this) + (particle.update(this) && this.particlez.splice(i, 1)))
    }
    static create (...args) {
        effex.push(new Effex(...args))
    }
}

class Box {
    constructor (...args) {
        [this.type, this.spec] = args
        this.width = this.height = SIZE
    }
    init () {
        if(this.type === 'weapon'){
            const arr = boxes.filter(box => box.type === 'weapon'), i = arr.indexOf(this)
            this.x = 575
            this.y = i * 50 - (arr.length * 50) / 2 + 300
            this.weapon = this.spec.weapon === 'bow' ? 'bow' : 'sword'
            this.name = this.spec.obj.name
            this.weaponType = this.spec.type
            this.desc = this.spec.obj.desc
        }
        else {
            const arr = boxes.filter(box => box.type !== 'weapon'), i = arr.indexOf(this)
            this.x = i * 50 - (arr.length * 50) / 2 + 300
            this.y = 575
        }
    }
    draw () {
        strokeWeight(2)
        stroke(0, 37.5)
        rectMode(1)
        fill(255, 150)
        rect(this.x, this.y, this.width, this.height)
        if (this.type === 'weapon') {
            pushMatrix()
                translate(this.x, this.y)
                rotate(this.weapon === 'sword' ? -90 : 0)
                scale(0.5)
                image(graphix[`${this.weapon}_${this.name}`], 0, 0)
            popMatrix()
        }
        else image(graphix[`key_${this.type.name}`], this.x, this.y)
        
    }
    hover () {
        if(col.pr({x: mouseX, y: mouseY}, this)){
            cursor.type = 'none'
            
            noStroke()
            fill(237.5, 237.5, 187.5)
            rect(mouseX, mouseY, this.desc.length * 5, 40, 3)
            textSize(10)
            fill(100)
            text(this.name, mouseX, mouseY - 12.5)
            textSize(8)
            text(this.weaponType, mouseX, mouseY)
            text(this.desc, mouseX, mouseY + 12.5)
        }
    }
}

class Choice {
    static init () {
        const weaponz = game.playerLevel(player.inventory.weaponz), arr = [], data = {
            bow: Object.keys(game.bow), 
            thrust: Object.keys(game.sword.thrust), 
            slice: Object.keys(game.sword.slice),
            pos: [
                {x: 200, y: 225},
                {x: 400, y: 225},
                {x: 200, y: 425},
                {x: 400, y: 425}
            ]
        }
        
        for(let key in weaponz){
            const i = weaponz[key]
            if(i < 3) arr.push({weapon: key, type: data[key][i + 1]})
        }
        ['bow', 'thrust', 'slice'].filter(weapon => !(weapon in weaponz)).forEach(weapon => {
            arr.push({weapon: weapon, type: data[weapon][0]})
        })
        while(arr.length < 4) arr.push({health: 50})
        arr.shuffle()
        arr.forEach((el, i) => {
            choices.push(new Choice(el, data.pos[i].x, data.pos[i].y, 200, 200))
        })
    }
    static choose (obj) {
        if(obj.health) player.reset += 50
        else {
            player.inventory.weaponz.splice(player.inventory.weaponz.findIndex(weapon => obj.bow ? (weapon instanceof Bow) : !(weapon instanceof Bow) && weapon.attack.type === obj.weapon), 1, obj.bow ? new Bow(obj.type, true) : new Sword(`${obj.weapon === 'thrust' ? 't' : 's'}.${obj.type}`, true))
        }
        transition.flash()
        choices.forEach(choice => choice.display = true)
    }
    constructor (...args) {
        [this.spec, this.x, this.y, this.width, this.height] = args
        this.alpha = 200
        this.on = false
        this.chosen = false
        this.display = false
        this.spec.bow = this.spec.weapon === 'bow'
    }
    draw () {
        stroke(250, 100)
        strokeWeight(5)
        fill(250, this.alpha)
        rect(this.x, this.y, this.width, this.height)
        textSize(50)
        fill(50)
        stroke(50, 100)
        strokeWeight(4)
        if(this.display){
            if(this.spec.health){
                stroke(225, 100, 100, 100)
                strokeWeight(5)
                fill(225, 100, 100)
                rect(this.x, this.y, 40, 150, 5)
                rect(this.x, this.y, 150, 40, 5)
            }
            else {
                const isBow = this.spec.bow
                pushMatrix()
                    translate(this.x, this.y - (isBow ? 0 : 30))
                    scale(1.5)
                    !isBow && rotate(-90)
                    image(graphix[`${isBow ? 'bow' : 'sword'}_${this.spec.type}`], 0, 0)
                popMatrix()
                if(!isBow){
                    textSize(50)
                    fill(50)
                    stroke(50, 100)
                    strokeWeight(4)
                    text(this.spec.weapon, this.x, this.y + 75)
                }
            }
        }
        else {
            textSize(200)
            fill(0, 100)
            noStroke()
            text('?', this.x, this.y + 10)
        }
    }
    update () {
        this.on = col.pr({x: mouseX, y: mouseY}, this)
        this.alpha = lerp(this.alpha, this.on || this.chosen ? 225 : 100, 0.1)
    }
    click () {
        if(this.on && mouse.click && !this.display) this.chosen = true, Choice.choose(this.spec)
    }
    all () {
        this.draw()
        this.update()
        this.click()
    }
}

class Spark {
    static run () {
        sparkz.loop((spark, i) => {
            spark.all()
            if(!col.pr(spark, {x: 300, y: 300, width: width, height: height})) sparkz.splice(i, 1, new Spark(random(width), random(height)))
        })
    }
    constructor (...args) {
        [this.x, this.y] = args
        this.target = this.ang = random(360)
        this.timer = random(100, 200)
    }
    update () {
        if(this.timer-- <= 0 || this.x <= 0 || this.x >= width || this.y <= 0 || this.y >= height) this.target = random(360), this.timer = random(100, 200)
        this.ang = lerp(this.ang, this.target, 0.05)
        this.x += cos(this.ang) * 1
        this.y += sin(this.ang) * 1
    }
    draw () {
        noStroke()
        fill(250, 100)
        pushMatrix()
            translate(this.x, this.y)
            rotate(-this.ang)
            rect(0, 0, 3, 8, 5)
        popMatrix()
    }
    all () {
        this.draw()
        this.update()
    }
}

class Button {
    constructor (...args) {
        [this.message, this.x, this.y, this.width, this.height] = args
        this.h = 0
        this.color = 245
    }
    update () {
        if(col.pr({x: mouseX, y: mouseY}, this)){
            this.h = lerp(this.h, this.height, 0.15)
            this.color = lerp(this.color, 100, 0.15)
            if (mouse.click) {
                transition.flash()
                if(this.message === 'town'){
                    level = random(1, game.levelz.data.length) | 0
                    scene = 'game load'
                    town = true
                }
                else if(this.message === 'arena'){
                    level = 0
                    scene = 'game load'
                    town = false
                }
                else scene = this.message
            }
        }
        else {
            this.h = lerp(this.h, 0, 0.1)
            this.color = lerp(this.color, 245, 0.1)
        }
    }
    draw () {
        strokeWeight(5)
        stroke(245)
        fill(245, 50)
        rectMode(1)
        rect(this.x, this.y, this.width, this.height)
        noStroke()
        rectMode(0)
        fill(245)
        rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.h)
        textSize(this.height / 2)
        fill(this.color)
        text(this.message, this.x, this.y)
    }
    all () {
        this.draw()
        this.update()
    }
}
const buttons = {
    back: new Button('menu', 300, 562.5, 500, 50),
    menu: [
        new Button('town', 100, 500, 175, 100),
        new Button('arena', 300, 500, 175, 100),
        new Button('how', 500, 500, 175, 100)
    ]
}

const transition = {
    alpha: 0,
    flash () {
        this.alpha = 255
    },
    draw () {
        noStroke()
        rectMode(1)
        fill(255, this.alpha)
        rect(300, 300, 601, 601)
        this.alpha = lerp(this.alpha, 0, 0.1)
    }
}

const initializeGUI = inventory => {
    boxes = []
    const weaponz = inventory.weaponz
    weaponz.forEach((weapon, i) => {
        const cache = weapon.genre(), obj = cache.type === 'bow' ? game.bow[cache.name] : game.sword[cache.type][cache.name]
        boxes.push(new Box('weapon', {obj: obj, type: cache.type, weapon: cache.type === 'bow' ? 'bow' : 'sword'}))
    })
    boxes.forEach(box => box.init())
}
const cursor = {
    type: 'aim',
    draw: () => {
        if(cursor.type !== 'aim') window.cursor(cursor.type)
        else {
            window.cursor('none')
            //simple crosshairs
            stroke(250)
            strokeWeight(4)
            line(mouseX - 8, mouseY, mouseX + 8, mouseY)
            line(mouseX, mouseY - 8, mouseX, mouseY + 8)
            stroke(0)
            strokeWeight(2)
            line(mouseX - 8, mouseY, mouseX + 8, mouseY)
            line(mouseX, mouseY - 8, mouseX, mouseY + 8)
            
        }
    }
}

initializeGUI(player.inventory)
window.cursor('none')
player.sword = new Sword('s.basic', true)

for(let i = 100; i--;) sparkz.push(new Spark(random(width), random(height)))

draw = () => {
    try{
        //clearLogs()
    window.cursor('default')
    switch(scene){
        case 'graphix load':
            background(0, 0)
            load(graphix, 'menu')
        break
        case 'game load':
            game.levelz.create(level)
            scene = town ? 'town' : 'arena'
        break
        case 'menu':
            background(125, 225, 125)
            Spark.run()
            //title
            pushMatrix()
                translate(-25, 0)
                stroke(245)
                strokeWeight(10)
                noFill()
                //B
                beginShape()
                    vertex(100, 25)
                    bezierVertex(175, 25, 175, 75, 100, 75)
                    vertex(100, 75)
                    bezierVertex(175, 75, 175, 125, 100, 125)
                endShape(CLOSE)
                //R
                beginShape()
                    vertex(200, 25)
                    bezierVertex(262.5, 25, 262.5, 75, 200, 75)
                    vertex(250, 125)
                    vertex(200, 75)
                    vertex(200, 125)
                endShape(CLOSE)
                //A
                beginShape()
                    vertex(300, 125)
                    vertex(337.5, 25)
                    vertex(375, 125)
                endShape(CLOSE)
                //V
                beginShape()
                    vertex(400, 25)
                    vertex(437.5, 125)
                    vertex(475, 25)
                endShape()
                //E
                beginShape()
                    vertex(562.5, 25)
                    vertex(500, 25)
                    vertex(500, 75)
                    vertex(562.5, 75)
                    vertex(500, 75)
                    vertex(500, 125)
                    vertex(562.5, 125)
                endShape()
            popMatrix()
            
            sword(250, 300, 4.5, 52.5, 'nife')
            sword(350, 300, 4.5, -52.5, 'zaas')
            buttons.menu.forEach(button => button.all())
        break
        case 'how':
            background(125, 225, 125)
            Spark.run()
            textSize(100)
            fill(250)
            stroke(250, 100)
            strokeWeight(5)
            text('HOW', 300, 50)
            stroke(250)
            line(100, 100, 500, 100)
            textSize(25)
            noStroke()
            //ski.js isn't cooperatin' with line breaks today.
            text("click to attack", 300, 250)
            text('arrow keys/wasd to move', 300, 275)
            text("1, 2, an' 3 to switch weaponz")
            text('play in the town to get better weapons/health', 300, 350)
            text('fight in the arena to get on the leaderboard', 300, 375)
            buttons.back.all()
        break
        case 'town':
            game.run()
            keys['r'] && (scene = "game load")
            keyz.length < 1 && dudez.length < 1 && (Choice.init(), scene = "win")
            player.health <= 0 && (scene = 'ded')
            
        break
        case 'arena':
            game.run()
            player.health <= 0 && (scene = 'score')
        break
        case 'graphix dev':
            //graphic tests here
            clear()
            floor(0, 0, 7, 60)
            const w = 1, h = 1
            
            //graphic
            image(graphix.counter, 300, 300)
            
            
            noStroke()
            fill(255, 0, 0)
            rectMode(1)
            rect(300, 300 - 100, 400, 100)
            rect(300 - 150, 300, 100, 300)
            
            
            rectMode(0)
            noStroke()
            fill(0, 50)
            rect(0, 0, w, h)
        break
        case 'win':
            background(125, 225, 125)
            Spark.run()
            textSize(100)
            fill(250)
            stroke(250, 100)
            strokeWeight(5)
            text('SELECT', 300, 50)
            stroke(250)
            line(100, 100, 500, 100)
            choices.forEach(choice => choice.all())
            if(choices[0].display) buttons.back.all()
        break
        case 'ded':
            background(125, 225, 125)
            Spark.run()
            textSize(100)
            fill(250)
            stroke(250, 100)
            strokeWeight(5)
            text('DED', 300, 75)
            textSize(50)
            text(`you didn't make it.`, 300, 325)
            buttons.back.all()
        break
        case 'score':
            background(125, 225, 125)
            Spark.run()
            textSize(100)
            fill(250)
            stroke(250, 100)
            strokeWeight(5)
            text('SCORE', 300, 75)
            textSize(50)
            text(score, 300, 325)
            buttons.back.all()
    }
    transition.draw()
    mouse.click = false
    keys.release = []
    }catch(e){println(e.stack); noLoop()}
}
