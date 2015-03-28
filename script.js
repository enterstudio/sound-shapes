var effects = {}

effects.panner = new Tone.AutoPanner({
  "frequency" : .5,
  "amount" : 0
}).toMaster();


effects.feedbackDelay = new Tone.PingPongDelay({
  "delayTime" : "8n",
  "feedback" : 0.6,
  "wet" : 0.5
}).toMaster();

var effectsArray = d3.entries(effects)

//play a snare sound through it
var snare = function(){ return new Tone.Player("snare.mp3") }

var players = ['snare', 'agogoHigh', 'agogoLow', 'B1', 'hh', 'hho', 'kick'].map(function(str){
  var rv = {str: str}
  rv.effects = {}
  effectsArray.forEach(function(e){
    rv.effects[e.key] = (new Tone.Player('sounds/' + str + '.mp3')).connect(e.value)
  })
  return rv
})

var s = 540
var margin = 20

var iR = s/5
var oR = s/3

var svg = d3.select('body')
  .append('svg')
    .attr({height: s + margin*2, width: s + margin*2})
  .append('g')
    .translate([margin + s/2, margin + s/2])


var sounds = d3.range(0, 2*Math.PI, .3).map(function(d){
  var rv = {θ: d}
  rv.player = players[~~(Math.random()*players.length)]
  return rv
})

var color = d3.scale.category10()
var circles = svg.dataAppend(sounds, 'circle')
    .attr('r', 10)
    .attr('fill', ƒ('player', 'str', color))


effectsArray.forEach(function(d, i){
  d.θ = 2*Math.PI*i/effectsArray.length
})

var pairs = []
sounds.forEach(function(s){
  effectsArray.forEach(function(e){
    pairs.push({s: s, e: e, lastPlay: -10000})
  })
})

var lines = svg.dataAppend(pairs, 'path')
    .style({'stroke': 'black'})

var shapes = svg.dataAppend(effectsArray, 'path')
    .attr('d', ['M', [-5,-5], 'L', [5, -5], 'L', [5,5], 'L', [-5,5]].join(''))

d3.timer(function(t){

  sounds.forEach(function(d){
    d.curθ = d.θ + t/1000
    d.pos = [Math.cos(d.curθ)*iR, Math.sin(d.curθ)*iR]
  })

  effectsArray.forEach(function(d){
    d.pos = [Math.cos(d.θ + t*0)*oR, Math.sin(d.θ + t*0)*oR]
  })


  circles.translate(ƒ('pos'))
  shapes.translate(ƒ('pos'))

  lines.attr('d', function(d){
    return ['M', d.e.pos, 'L', d.s.pos].join('')
  })
})



















