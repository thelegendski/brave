//a few notez for judgez
/*
a && b is the same as if(a){b}
a ? b : c is the same as if(a){b} else{c}

if the code itself [not the function as that would be a result of bad commentin'] doesn't make sense, please post a question down below :).
*/

//all presets here
imageMode(1) //center images
ellipseMode(1) //center circlez
rectMode(1) //center rectanglez
textAlign(1, 1) //center text
    
//all event listeners here
//objects are faster as they only store the necessary keys.
const keys = {}, mouse = {}
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
//level data an' parser
const levelz = {
    data: [
        {
            map: [
                'bbbbbbbbbb',
                'b        b',
                'b        b',
                'b        b',
                'b        b',
                'b   bb   b',
                'b        b',
                'b        b',
                'b       rb',
                'bbbbbbbbbb'
            ],
            spec: ''
        }
    ],
    create (level) {
        const map = this.data[level].map,
              spec = this.data[level].spec.trim()
        //map here
        map.forEach((str, y) => {
            [...str].forEach((char, x) => {
                switch(char){
                    case 'b':
                        blox.push(new Block(x * SIZE, y * SIZE))
                    break
                    case 'r':
                        dudez.push(new Enemy('basic', x * SIZE, y * SIZE))
                }
            })
        })
        //regex parser for spec here
    }
}
//all game data
const game = {
    data: {
        arrows: {
            basic: {
                damage: 10
            }
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
    reset: 10,
    //health
    health: 100,
    //angle
    ang: 0,
    //functionz [
    //draw the player
    draw () {
        //draws the player image where the player is
        image(graphix.player, this.x, this.y)
    },
    //moves the player with acceleration an' semi-realistic friction
    move () {
        if(keys[UP]) this.vel.y -= this.acc
        else if(keys[DOWN]) this.vel.y += this.acc
        else this.vel.y = lerp(this.vel.y, 0, 0.1)
        
        if(keys[LEFT]) this.vel.x -= this.acc
        else if(keys[RIGHT]) this.vel.x += this.acc
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
            //cache the resolution to conflict
            const cache = col.rcp(this, block)
            //if the resolution exists, apply it
            cache && ([this.x, this.y] = cache)
        })
        
        //collide with arrowz
        arrowz.forEach((arrow, i) => 
            //if there is a collision
            col.cc(this, arrow) 
            //an' the player didn't shoot the arrow
            && arrow.archer !== 'player' 
            && (
                //splice the arrow
                arrowz.splice(i, 1), 
                //deal the appropriate 'mount of damage
                this.health -= game.data.arrows[arrow.type].damage
            )
        )
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
            Arrow.create(this.x + cos(this.ang) * 30, this.y + sin(this.ang) * 30, this.ang, 'player', 'basic'), 
            //set the bow to not drawn
            this.bow.draw.reach = false
        )
    },
    //use melee attack - add slice attack(?)
    melee () {
        //draw an' update the sword
        this.sword.run(this.x, this.y, this.ang)
        
        //if the mouse is pressed
        mouse[0] 
        //an' the sword can be thrusted
        && this.sword.thrust.val < 1 
        //thrust the sword
        && (this.sword.thrust.bool = true)
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
        //decide which attack to update
        this.bow ? this.shoot() : this.melee()
        //draw the player
        this.draw()
        //move the player
        this.move()
        //update player collisions
        this.collide()
        
        //if the player is ded
        player.health <= 0 
        //um, well they're ded
        && (scene = 'ded')
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

class Enemy {
    constructor (type, x, y) {
        this.type = type
        this.x = x
        this.y = y
        this.size = 50
        this.speed = 3
        this.health = 100
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
        this.x += cos(this.ang) * this.speed
        this.y += sin(this.ang) * this.speed
    }
    collide () {
        //collide with blox
        blox.forEach(block => {
            const cache = col.rcp(this, block)
            cache && ([this.x, this.y] = cache)
        })
        arrowz.forEach((arrow, i) => col.cc(this, arrow) && arrow.archer === 'player' && (Effex.create(10, arrow), this.health -= game.data.arrows[arrow.type].damage, arrowz.splice(i, 1)))
        let cache = col.ccp(this, player, 50), point
        cache && ([this.x, this.y] = cache)
        if(player.sword){
            cache = false
            if(player.sword.thrust.bool) {
                cache = col.clp(this, player.sword.pos.a, player.sword.pos.b) ? 'a' : col.clp(this, player.sword.pos.c, player.sword.pos.b) ? 'c' : false
                if(cache) point = col.cpl(this, player.sword.pos[cache], player.sword.pos.b)
            }
            cache && (Effex.create(1, {x: point[0], y: point[1]}, color(0)), this.health -= 5)
        }
    }
    all () {
        this.ang = atan2(player.y - this.y, player.x - this.x)
        this.draw()
        this.move()
        this.collide()
    }
}

class Block {
    constructor (...args) {
        [this.x, this.y] = args
        this.width = this.height = SIZE
    }
    draw () {
        noStroke()
        fill(100)
        rect(this.x, this.y, this.width + 1, this.height + 1)
    }
    collide () {
        arrowz.forEach((arrow, i) => col.rc(arrow, this) && (Effex.create(10, arrow, color(100)), arrowz.splice(i, 1)))
        effex.forEach(effect => effect.particlez.forEach((particle, i) => col.rc(particle, this) && effect.particlez.splice(i, 1)))
    }
    all () {
        this.draw()
        this.collide()
    }
}

class Arrow {
    constructor (...args) {
        [this.x, this.y, this.ang, this.archer, this.type] = args
        this.speed = 10
        this.size = 20 * (3 / 4)
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

/*
should the bow draw back?
ngl, not sure, but willin' to do anythin' to
juice this up.
*/
class Bow {
    constructor(...args){
        [this.x, this.y, this.ang, this.timer] = args
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
        if(this.draw.bool){
            pushMatrix()
                translate(this.draw.arrow, 0)
                rotate(90)
                scale(0.75)
                image(graphix.arrow, 0, 0)
            popMatrix()
            this.draw.val = lerp(this.draw.val, this.draw.max, 60 / (this.timer * 10))
            this.draw.arrow = lerp(this.draw.arrow, 30, 60 / (this.timer * 10))
            this.draw.val > this.draw.max - 1 && (this.draw.reach = true, this.draw.arrow = 50, this.draw.bool = false)
        }
        else this.draw.val = lerp(this.draw.val, 0, 60 / (this.timer * 10))
        this.draw.val = constrain(this.draw.val, 0, this.draw.max)
        
        popMatrix()
    }
}
player.bow = new Bow(player.x, player.y, player.ang, 50)

//melee isn't easy; i think.
class Sword {
    constructor (...args) {
        [this.x, this.y, this.ang, this.timer] = args
        this.pos = {
            a: {x: 0, y: 0},
            A: {
                x: 30,
                y: -10
            },
            b: {x: 0, y: 0},
            B: {
                x: 60,
                y: 0
            },
            c: {x: 0, y: 0},
            C: {
                x: 30,
                y: 10
            },
            d: {x: 0, y: 0},
            D: {
                x: 30,
                y: 0
            }
        }
        this.thrust = {
            bool: false,
            val: 0
        }
    }
    rotate (key) {
        key = key.toLowerCase()
        const point = this.pos[key], pos = this.pos[key.toUpperCase()]
        const c = cos(-this.ang), s = sin(-this.ang)
        this.pos[key].x = (c * pos.x) + (s * pos.y) + this.x + cos(this.ang) * this.thrust.val
        this.pos[key].y = (c * pos.y) - (s * pos.x) + this.y + sin(this.ang) * this.thrust.val
    }
    run (...args) {
        [this.x, this.y, this.ang] = args
        
        
        for(let key in this.pos) key === key.toLowerCase() && this.rotate(key)
        
        strokeWeight(1)
        stroke(125)
        fill(150)
        triangle(this.pos.a.x, this.pos.a.y, this.pos.b.x, this.pos.b.y, this.pos.c.x, this.pos.c.y)
        strokeWeight(2)
        stroke(225, 100, 100)
        line(this.pos.a.x, this.pos.a.y, this.pos.b.x, this.pos.b.y)
        line(this.pos.c.x, this.pos.c.y, this.pos.b.x, this.pos.b.y)
        
        
        if(this.thrust.bool) (this.thrust.val = lerp(this.thrust.val, 30, 60 / (this.timer * 10)), this.thrust.val > 30 - 1 && (this.thrust.bool = false))
        else this.thrust.val = lerp(this.thrust.val, 0, (60 / (this.timer * 10)))
    }
}
//player.sword = new Sword(0, 0, 0, 25)

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
        for(let i = arr.length; i--;){
            //cache item in particle array for increased performance an' readability
            const p = arr[i]
            //draw particle, then update particle.
            //if particle is invisible, delete it.
            p.draw(this) + (p.update(this) && this.particlez.splice(i, 1))
        }
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
            levelz.create(0)
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
                arrowz.forEach((arrow, i) => arrow.x < cam.x - width * 1.5 || arrow.x > cam.x + width * 1.5 || arrow.y < cam.y - height * 1.5 || arrow.y > cam.y + height * 1.5 ? arrowz.splice(i, 1) : arrow.all())
                blox.forEach(block => block.all())
                player.all()
                dudez.forEach((dude, i) => dude.health <= 0  ? (Effex.create(25, dude), dudez.splice(i, 1)) : dude.all())
            popMatrix()
            
            noStroke()
            fill(50, 100)
            textFont('Lato bold', 20)
            text(fps.toFixed(1), width - ctx.measureText(fps.toFixed(1)).width / 2 - 3, height - 20 / 2)
            //popMatrix()
        break
        case 'graphix dev':
            //graphic tests here
            background(250)
            rectMode(0)
            noStroke()
            fill(0, 50)
            rect(0, 0, 25, 50)
            arrow(300, 300, 1, 0)
        break
        case 'game dev':
            //game experiments here
    }
    mouse.click = false
    }catch(e){println(e.stack); noLoop()}
}
//<script>
