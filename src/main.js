//a few notez for judgez
/*
a && b is the same as if(a){b}
a ? b : c is the same as if(a){b} else{c}

if the code itself [not the function as that would be a result of bad commentin'] doesn't make sense, please post a question down below :).
*/

//all presets here
imageMode(1)
ellipseMode(1)
rectMode(1)
textAlign(1, 1)
    
//all event listeners here
const keys = {}, mouse = {}
keyPressed = e => keys[e.key.toLowerCase()] = keys[e.keyCode] = true
keyReleased = e => keys[e.key.toLowerCase()] = keys[e.keyCode] = false
mousePressed = e => mouse[e.button] = true
mouseReleased = e => mouse[e.button] = false
mouseClicked = () => mouse.click = true
    
//all globals here
const SIZE = 50
let dudez = [], blox = [], keyz = [], decor = [], arrowz = [], effex = []
let scene = 'graphix load'
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
let img_index = 0
const load = (obj, next='menu') => {
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
    x: 50,
    y: 50,
    vel: {
        x: 0,
        y: 0,
        max: 5
    },
    size: 50,
    acc: 0.25,
    timer: 0,
    reset: 10,
    health: 100,
    
    //functionz
    draw () {
        image(graphix.player, this.x, this.y)
    },
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
    collide () {
        blox.forEach(block => {
            const cache = col.rcp(this, block)
            cache && ([this.x, this.y] = cache)
        })
        arrowz.forEach((arrow, i) => col.cc(this, arrow) && arrow.archer !== 'player' && (arrowz.splice(i, 1), this.health -= game.data.arrows[arrow.type].damage))
    },
    shoot () {
        this.timer-- <= 0 && mouse[0] && (Arrow.create(this.x, this.y, atan2(cam.my - this.y, cam.mx - this.x), 'player', 'basic'), this.timer = this.reset)
    },
    //wrapper for all functionz
    all () {
        this.draw()
        this.move()
        this.collide()
        this.shoot()
        player.health <= 0 && (scene = 'ded')
    }
}

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
        blox.forEach(block => {
            const cache = col.rcp(this, block)
            cache && ([this.x, this.y] = cache)
        })
        arrowz.forEach((arrow, i) => col.cc(this, arrow) && arrow.archer === 'player' && (Effex.create(10, arrow), this.health -= game.data.arrows[arrow.type].damage, arrowz.splice(i, 1)))
        const cache = col.ccp(this, player, 50)
        cache && ([this.x, this.y] = cache)
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
        this.size = 20
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

class Bow {
    constructor(obj){
        this.x = obj.x
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
