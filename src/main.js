//a few notez for judgez
/*
a && b is the same as if(a){b}
a ? b : c is the same as if(a){b} else{c}

if the code itself [not the function as that would be a result of bad commentin'] doesn't make sense, please post a question down below :).
*/

//native prototypes. 
//for my sanity, i'm sure others will claim it's bad practice as it may create unwanted bugs, but those cases are not present here.
Array.prototype.loop = function(func) {
    for(let i = this.length; i--;) func(this[i], i, this)
}
col.pr = (p, r, m = 1) => p.x > (m ? (r.x - r.width / 2) : r.x) && p.x < (m ? (r.x + r.width / 2) : r.width) && p.y > (m ? (r.y - r.height / 2) : r.y) && p.y < (m ? (r.y + r.height / 2) : r.height)

//all presets here
imageMode(1) //center images
ellipseMode(1) //center circlez
rectMode(1) //center rectanglez
textAlign(1, 1) //center text
strokeJoin(ROUND)
strokeCap(ROUND)
    
//all event listeners here
//objects are faster as they only store the necessary keys.
const keys = {}, mouse = {}, SPACE = 32
//key event listeners
keyPressed = e => keys[e.key.toLowerCase()] = keys[e.keyCode] = true
keyReleased = e => keys[e.key.toLowerCase()] = keys[e.keyCode] = false
//mouve event listeners
mousePressed = e => mouse[e.button] = true
mouseReleased = e => mouse[e.button] = false
mouseClicked = () => mouse.click = true
    
//all globals here
//global constants
const SIZE = 50
//global arrays
let dudez = [], blox = [], keyz = [], decor = [], arrowz = [], effex = []
//global variables
let scene = 'graphix load'
//all game data
const game = {
    colorz: [
        {color: color(75, 125, 175), name: "blue"},
        {color: color(225, 225, 50), name: "yellow"},
        {color: color(75, 175, 75), name: "green"},
        {color: color(225, 75, 75), name: "red"},
        {color: color(225, 150, 50), name: "orange"},
        {color: color(245, 175, 150), name: "gray"}
    ],
    bow: {
        basic: {
            damage: 25,
            reload: 50,
            speed: 10
        }
    },
    sword: {
        thrust: {
            basic: {
                reach: 15,
                speed: 50,
                damage: 2,
                pos: {
                    A: {
                        x: 30,
                        y: -10
                    },
                    B: {
                        x: 60,
                        y: 0
                    },
                    C: {
                        x: 30,
                        y: 10
                    },
                    D: {
                        x: 30,
                        y: 0
                    }
                }
            }
        },
        slice: {
            basic: {
                reach: 5,
                speed: 75,
                damage: 4,
                pos: {
                    A: {
                        x: 30,
                        y: -10
                    },
                    B: {
                        x: 60,
                        y: 0
                    },
                    C: {
                        x: 30,
                        y: 10
                    },
                    D: {
                        x: 30,
                        y: 0
                    }
                }
            }
        }
    },
    levelz: {
        data: [
            {
                map: [
                    'bbbbbbbbbbbbbbb',
                    'b             b',
                    'b p           b',
                    'b       0     b',
                    'b             b',
                    'bbbbbdbbbbbbbbb',
                    'b             b',
                    'b             b',
                    'b             b',
                    'b             b',
                    'b             b',
                    'b             b',
                    'b             b',
                    'b             b',
                    'bbbbbbbbbbbbbbb'
                ],
                spec: ''
            }
        ],
        counter: 0,
        create (level) {
            const map = this.data[level].map,
                  spec = this.data[level].spec.trim()
            blox = []
            dudez = []
            arrowz = []
            effex = []
            keyz = []
            this.counter = 0
            //map here
            map.forEach((str, y) => {
                [...str].forEach((char, x) => {
                    const X = x * SIZE, Y = y * SIZE
                    switch(char){
                        case 'b':
                            blox.push(new Block(X, Y))
                        break
                        case 'r':
                            dudez.push(new Enemy('basic', X, Y))
                        break
                        case 'p':
                            player.x = X
                            player.y = Y
                        break
                        case 'd':
                            blox.push(new Door(game.colorz[this.counter++], X, Y))
                        default:
                            (/\d/).test(char) && keyz.push(new Key(game.colorz[Number(char)], X, Y))
                    }
                })
            })
            //regex parser for spec here
        }
    }
}

//all graphix here
//graphic functions here
function arrow (x, y, s, r) {
    pushMatrix()
        translate(x, y)
        scale(s)
        rotate(r)
        strokeWeight(4)
        strokeJoin(ROUND)
        stroke(200, 150, 100)
        line(0, -10, 0, 10)
        stroke(150)
        line(0, 10, -5, 15)
        line(0, 10, 0, 17.5)
        line(0, 10, 5, 15)
        fill(150)
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
//graphix object that stores images
const graphix = {
    player () {
        noStroke()
        fill(150, 225, 150)
        ellipse(25, 25, 50, 50)
        return get(0, 0, 50, 50)
    },
    arrow () {
        arrow(12.5, 25, 1, 0)
        return get(0, 0, 25, 50)
    }
}

//we need doorz
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
    constructor(...args){
        //should just be this.type once i get more done so it references the game data object for all necessary specs
        [this.type] = args
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
    run (...args) {
        [this.x, this.y, this.ang] = args
        pushMatrix()
            translate(this.x, this.y)
            rotate(this.ang)
            noFill()
            strokeCap(ROUND)
            strokeWeight(3)
            stroke(200, 150, 100)
            curve(30, -30, 60, 0, 30, 30)
            stroke(150)
            curve(30, -30, 30 - this.draw.val, 0, 30, 30)
            stroke(245, 200, 150, 100)
            fill(245, 200, 150)
            ellipse(45, 0, 12, 12)
            ellipse(30 - this.draw.val / 2, 0, 12, 12)
        if(this.draw.bool){
            pushMatrix()
                translate(this.draw.arrow, 0)
                rotate(90)
                scale(0.75)
                image(graphix.arrow, 0, 0)
            popMatrix()
            this.draw.val = lerp(this.draw.val, this.draw.max, 60 / (this.timer * 10))
            this.draw.arrow = lerp(this.draw.arrow, 30, 60 / (this.timer * 10))
            this.draw.val > this.draw.max - 1 && !mouse[0] && (this.draw.reach = true, this.draw.arrow = 50, this.draw.bool = false)
        }
        else this.draw.val = lerp(this.draw.val, 0, 60 / (this.timer * 10))
        this.draw.val = constrain(this.draw.val, 0, this.draw.max)
        popMatrix()
    }
}


//melee isn't easy; i think.
//eh, not terrible
class Sword {
    constructor (...args) {
        [this.type, this.player] = args
        this.type = this.type.split('.')
        this.data = game.sword[this.type[0] === 't' ? 'thrust' : 'slice'][this.type[1]]
        this.pos = {
            a: {x: 0, y: 0},
            b: {x: 0, y: 0},
            c: {x: 0, y: 0},
            d: {x: 0, y: 0},
            ...this.data.pos
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
    rotate (key) {
        key = key.toLowerCase()
        const point = this.pos[key], pos = this.pos[key.toUpperCase()]
        const c = cos(-this.ang - this.attack.ang), s = sin(-this.ang - this.attack.ang)
        this.pos[key].x = (c * pos.x) + (s * pos.y) + this.x + cos(this.ang) * this.attack.thrust
        this.pos[key].y = (c * pos.y) - (s * pos.x) + this.y + sin(this.ang) * this.attack.thrust
    }
    updatePosition () {
        for(let key in this.pos) key === key.toLowerCase() && this.rotate(key)
    }
    draw () {
        strokeWeight(1)
        stroke(125)
        fill(150)
        triangle(this.pos.a.x, this.pos.a.y, this.pos.b.x, this.pos.b.y, this.pos.c.x, this.pos.c.y)
        strokeWeight(2)
        stroke(225, 100, 100)
        line(this.pos.a.x, this.pos.a.y, this.pos.b.x, this.pos.b.y)
        line(this.pos.c.x, this.pos.c.y, this.pos.b.x, this.pos.b.y)
    }
    update () {
        blox.forEach(block => {
            ['a', 'b', 'c', 'd'].forEach(char => {
                col.pr(this.pos[char], block) && (this.attack.bool = false)
            })
        })
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
    all (...args) {
        [this.x, this.y, this.ang] = args
        this.updatePosition()
        this.draw()
        this.update()
    }
}

const player = {
    //data
    //sword: new Sword('s.basic', true),
    bow: new Bow('basic'),
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
    reset: 10,
    //health
    health: 100,
    //angle
    ang: 0,
    inventory: {
        keyz: [],
        weaponz: []
    },
    //functionz [
    //draw the player
    draw () {
        pushMatrix()
            translate(this.x, this.y)
            rotate(this.ang - 90)
            noStroke()
            fill(225, 125, 125)
            rect(0, -30, this.health / (100 / 50), 5, 5)
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
                Effex.create(10, arrow, color(125, 225, 125)),
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
            dudez.forEach((d, j) => {
                if(i !== j){
                    const cache = col.ccp(dude, d, 50)
                    cache && ([dude.x, dude.y] = cache)
                }
            })
        })
        
        keyz.forEach((key, i) => col.cc(this, key, 70) && (keyz.splice(i, 1), this.inventory.keyz.push(key.colour)))
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
    update (obj) {
        for(let key in obj){
            if (typeof obj[key] !== 'object') this[key] = obj[key]
            else for(let k in obj[key]) this[key][k] = obj[key][k]
        }
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

col.rcc = (a,b,m=false)=>{
    clearLogs()
    println(a.x, constrain(a.x, m ? b.x - b.width / 2 : min(b.x, b.x + b.width), m ? b.x + b.width / 2 : max(b.x, b.x + b.width)))
    println(a.y, constrain(a.y, m ? b.y - b.height / 2 : min(b.y, b.y + b.height), m ? b.y + b.height / 2 : max(b.y, b.y + b.height)))
    return dist(a.x, a.y, constrain(a.x, m ? b.x - b.width / 2 : min(b.x, b.x + b.width), m ? b.x + b.width / 2 : max(b.x, b.x + b.width)), constrain(a.y, m ? b.y - b.height / 2 : min(b.y, b.y + b.height), m ? b.y + b.height / 2 : max(b.y, b.y + b.height))) <= (a.size ?? a.s) / 2
}

class Enemy {
    static sword (striker, oof) {
        let cache = false
        if(striker.sword.attack.bool) {
            cache = col.clp(oof, striker.sword.pos.a, striker.sword.pos.b) ? col.clp(oof, striker.sword.pos.a, striker.sword.pos.b) : col.clp(this, striker.sword.pos.c, striker.sword.pos.b) ? col.clp(this, striker.sword.pos.c, striker.sword.pos.b) : false
        }
        cache && (Effex.create(1, {x: cache[0], y: cache[1]}, striker.player ? color(125, 225, 125) : color(0)), oof.health -= striker.sword.damage)
        
    }
    constructor (type, x, y) {
        this.type = type
        this.x = x
        this.y = y
        this.size = 50
        this.speed = 3
        this.health = 100
        this.bow = new Bow('basic')
        //this.sword = new Sword(25, 'thrust')
        this.range = this.bow ? {
            in: 200,
            out: 300,
            is: false
        } : {
            in: player.size + this.sword.pos.D.x + (this.sword.type === 'thrust' ? 15 : 0),
            out: player.size + this.sword.pos.B.x + (this.sword.type === 'thrust' ? 15 : 0),
            is: false
        }
        this.dist = Infinity
    }
    draw () {
        pushMatrix()
        translate(this.x, this.y)
        rotate(this.ang - 90)
        noStroke()
        fill(225, 125, 125)
        rect(0, -30, this.health / 2.5, 5, 5)
        ellipse(0, 0, this.size, this.size)
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
        
        this.range.bool &&
        //an' the sword can be thrusted
        this.sword.attack.val < 1 
        //thrust the sword
        && (this.sword.attack.bool = true)
    }
    shoot () {
        //draw the bow an' update position/animation
        this.bow.run(this.x, this.y, this.ang)
        
        //if the mouse is pressed
        this.range.bool
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
        arrowz.forEach((arrow, i) => col.cc(this, arrow) && arrow.player && (Effex.create(10, arrow), this.health -= arrow.damage, arrowz.splice(i, 1)))
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

class Block {
    constructor (...args) {
        [this.x, this.y, this.door] = args
        this.width = this.height = SIZE
    }
    draw () {
        noStroke()
        fill(100)
        rect(this.x, this.y, this.width + 1, this.height + 1)
    }
    collide () {
        arrowz.forEach((arrow, i) => col.rc(arrow, this) && (Effex.create(10, arrow, color(100)), arrowz.splice(i, 1)))
    }
    all () {
        this.draw()
        this.collide()
    }
}

class Door extends Block {
    constructor(colour, ...args){
        super(...args, true)
        this.color = colour
        this.opened =  false
        this.w = this.width
    }
    draw () {
        imageMode(0)
        image(graphix[`door_blue`], this.x - this.width / 2, this.y - this.height / 2 - 0.75, this.w, this.height + 1.5)
        imageMode(1)
    }
    update () {
        if(this.opened) this.w = lerp(this.w, 0, 0.075)
        else this.w = lerp(this.w, this.width, 0.075)
    }
    open () {
        if(col.rc(player, this) && keys[SPACE] && player.inventory.keyz.some(key => key.name === this.color.name)) this.opened = true
    }
    close () {
        this.open && dist(player.x, player.y, this.x, this.y) > 200 && (this.open = false)
    }
    collide () {
        arrowz.forEach((arrow, i) => col.rc(arrow, {x: this.x - this.width / 2, y: this.y - this.height / 2, width: this.w, height: this.height}, 0) && (Effex.create(10, arrow, color(100)), arrowz.splice(i, 1)))
    }
    all () {
        this.draw()
        this.update()
        this.open()
        //close door if it's open an' the player isn't nearby
        this.opened && dist(player.x, player.y, this.x, this.y) > 100 && (this.opened = false)
        this.collide()
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
            image(graphix.arrow, 0, 0)
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

draw = () => {
    try{
    switch(scene){
        case 'graphix load':
            background(0, 0)
            load(graphix, 'game load')
        break
        case 'game load':
            game.levelz.create(0)
            scene = 'game'
        break
        case 'menu':
            
        break
        case 'shop':
            
        break
        case 'game':
            background(250)
            cam.update()
            rectMode(1)
            /*pushMatrix()
            translate(300, 300)
            scale(1.25)
            translate(-300, -300)*/
            pushMatrix()
                translate(-cam.x, -cam.y)
                effex.forEach(effect => effect.update())
                arrowz.loop((arrow, i) => arrow.x < cam.x - width * 1.5 || arrow.x > cam.x + width * 1.5 || arrow.y < cam.y - height * 1.5 || arrow.y > cam.y + height * 1.5 ? arrowz.splice(i, 1) : arrow.all())
                blox.forEach(block => block.all())
                dudez.loop((dude, i) => dude.health <= 0 ? (Effex.create(25, dude), dudez.splice(i, 1)) : dude.all())
                keyz.forEach(key => key.draw())
                player.all()
            popMatrix()
            
            noStroke()
            fill(50, 100)
            textFont('Lato bold', 20)
            text(fps.toFixed(1), width - ctx.measureText(fps.toFixed(1)).width / 2 - 3, height - 20 / 2)
            
            keys['r'] && (scene = "game load")
            //popMatrix()
        break
        case 'graphix dev':
            //graphic tests here
            background(250)
            key(12.5, 20, 1, 0, color(75, 125, 175))
            rectMode(0)
            noStroke()
            fill(0, 50)
            rect(0, 0, 25, 35)
        break
        case 'game dev':
            //game experiments here
        break
        case 'ded':
            background(0)
    }
    mouse.click = false
    }catch(e){println(e.stack); noLoop()}
}
