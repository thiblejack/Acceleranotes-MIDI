var clefSol;
var clefFa;
var clefUt;

var clavierMidi;

var midi = false;

var A5;

//var buttonColours = generateColours(7);
var gris = '#7a9cac';
//'rgb(122,156,171)';//'#55666e';//225;//

var noir = '#000000';

var colButtons = '#ffffff';

//var buttonsDimensions = [[]];

var clef = 0;

var pitchMin = 0;
var pitchMax = 0

var middlePitch = 0;

var pitchBorder = [[26,34,42],[14,22,30],[20,28,36]];

var marge = 10;
var pas = 10;
var factor;

var dy;

var notes;
var nbrn = 0;
var nbrf = 0;

var nbrl = 0;

var vitesse;

var degres = ['do', 'ré', 'mi', 'fa', 'sol', 'la', 'si'];

//var buttons1 = ['1','2','3','4','5','6','7'];
//var buttons2 = ['q','w','e','r','t','z','u'];
//var buttons3 = ['a','s','d','f','g','h','j'];
var buttons4 = ['y', 'x', 'c', 'v', 'b', 'n', 'm'];

var buttons = [];
var button = -1;

var time = 0;

var hasLost = false;
var hasBegun = false;
var help = false;

var highscore = 251;
var newRecord = false;
var pseudo = 'Mozart';
var pseudoOk = false;

var lostMessage = '';

window.sessionStorage.removeItem('temp');

class Note {
  constructor(p, x) {
    if (help) {
      this.pitch = p;
      this.x = x;
    } else {
      var n0, n1;

      if(pitchMin > pitchBorder[clef][0] &&
         pitchMin < pitchBorder[clef][2]) {
        n0 = pitchMin;
      }
      else {
        n0 = pitchBorder[clef][0];
      }

      if(pitchMax > pitchBorder[clef][0] &&
         pitchMax < pitchBorder[clef][2]) {
        n1 = pitchMax;
      }
      else {
        n1 = pitchBorder[clef][2];
      }

      this.pitch = floor(random(n0,n1+1));
      this.x = width - 1.8 * marge;
    }
    this.adjustY();
    this.colour = noir;
  }

  adjustY() {
    //this.y = height / 2 + (4 - this.pitch / 2) * marge + 1.6 * dy;
    /*switch(clef) {
      case 0: middlePitch = 34; break;//4*7+6;
      case 1: middlePitch = 22; break;//3*7+1;
      case 2: middlePitch = 28; break;//4*7;
    }*/
    middlePitch = pitchBorder[clef][1];
    this.y = height/2 + (middlePitch-this.pitch)*marge/2 + 1.6*dy;
  }

  setColour(c) {
    this.colour = c;
  }

  draw() {
    //console.log(this.pitch, middlePitch);

    noStroke();
    fill(this.colour);

    translate(this.x + sqrt(marge) / 40, this.y + sqrt(marge) / 40);
    rotate(-0.4);
    ellipse(0, 0, 1.2 * marge, 0.9 * marge);
    rotate(0.4);
    translate(-this.x - sqrt(marge) / 40, -this.y - sqrt(marge) / 40);

    stroke(this.colour);

    var hauteur = this.pitch;

    if (hauteur <= middlePitch) {
      line(this.x + 0.54 * marge, this.y - 0.1 * marge,
           this.x + 0.54 * marge, this.y - 3 * marge);
      while(hauteur < middlePitch-4) {
        if((middlePitch-hauteur)%2 == 0) {
          line(this.x - 0.8 * marge, this.y - (hauteur-this.pitch)*marge/2,
               this.x + 0.8 * marge, this.y - (hauteur-this.pitch)*marge/2);
        }
        hauteur++;
      }
    } else {
      line(this.x - 0.54 * marge, this.y + 0.1 * marge,
           this.x - 0.54 * marge, this.y + 3 * marge);
      while(hauteur > middlePitch+4) {
        if((hauteur-middlePitch)%2 == 0) {
          line(this.x - 0.8 * marge, this.y + (this.pitch-hauteur)*marge/2,
               this.x + 0.8 * marge, this.y + (this.pitch-hauteur)*marge/2);
        }
        hauteur--;
      }
    }

    /*switch (this.pitch) {
      case 0:
        line(this.x - 0.8 * marge, this.y - marge,
          this.x + 0.8 * marge, this.y - marge);
        line(this.x - 0.8 * marge, this.y,
          this.x + 0.8 * marge, this.y);
        break;
      case 1:
        line(this.x - 0.8 * marge, this.y - marge / 2,
          this.x + 0.8 * marge, this.y - marge / 2);
        break;
      case 2:
        line(this.x - 0.8 * marge, this.y,
          this.x + 0.8 * marge, this.y);
        break;
      case 14:
        line(this.x - 0.8 * marge, this.y,
          this.x + 0.8 * marge, this.y);
        break;
      case 15:
        line(this.x - 0.8 * marge, this.y + marge / 2,
          this.x + 0.8 * marge, this.y + marge / 2);
        break;
      case 16:
        line(this.x - 0.8 * marge, this.y,
          this.x + 0.8 * marge, this.y);
        line(this.x - 0.8 * marge, this.y + marge,
          this.x + 0.8 * marge, this.y + marge);
        break;
    }*/
  }

  move(v) {
    this.x -= v;
  }

  position() {
    return this.x;
  }

  getY() {
    return this.y - 0.35 * marge;
  }
}

class Button
{
  constructor(texte)
  {
    this.texte = texte;
    var f;
    switch(texte)
    {
      case 'do': f = 0.05;   break;
      case 'ré': f = 0.07; break;
      case 'mi': f = 0.18; break;
      case 'fa': f = 0.27; break;
      case 'sol':f = 0.44; break;
      case 'la': f = 0.275;break;
      case 'si': f = 0.1; break;
    }

    this.rY = random(8, 22) - 21 * f;
    this.rW = random(0.4, 0.8)     * (0.3 + 1.3*f);
    this.rH = random(0.5, 1.3) * (0.1 + 2.6*f);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y + pas * this.rY;
  }

  setColour(c) {
    switch (c) {
      case 0:
        this.colour = noir;
        this.texCol = '#ffffff';
        break;
      case 1:
        this.colour = '#108fd2';
        this.texCol = '#ffffff';
        break;
      case 2:
        this.colour = '#e53917';
        this.texCol = '#ffffff';
        break;
      case 3:
        this.colour = '#fedf00';
        this.texCol = noir;
        break;
      case 4:
        this.colour = '#e00079';
        this.texCol = '#ffffff';
        break;
      default:
        this.colour = '#55666e';
        this.texCol = '#ffffff';
        break;
    }
  }

  draw(b) {
    noStroke();

    this.w = 3.5 * marge * (1.1 + 0.9*this.rW);

    this.h = 25 * pas * (1 + this.rH);

    fill(255);
    rect(this.x - this.w / 2 - 0.5 * marge, this.y - this.h / 2 - pas,
      this.w + marge, this.h + 2 * pas);

    fill(b ? 'rgb(0,0,0)' : this.colour);

    rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);

    textAlign(CENTER, CENTER);
    textSize(2.6 * marge);
    fill(b ? this.colour : this.texCol);
    text(this.texte, this.x, this.y - pas);
  }

  getX() {
    return this.x - this.w / 2;
  }

  getY() {
    return this.y - this.h / 2;
  }
}

function drawHelpButton() {
  noStroke();
  //fill(225);
  fill(colButtons);
  let x = width/2-5*factor;
  let y = height / 15;
  let r = 2.2 * factor;

  circle(x, y, r);

  noStroke();
  fill(noir);
  textAlign(CENTER, CENTER);
  textSize(3.8 * factor);
  text(help ? '' : '?', x, y - 0.5 * factor);

  if (help) {
    let taille = factor;
    stroke(noir);
    strokeWeight(factor / 4.6);
    line(x - taille, y - taille, x + taille, y + taille);
    line(x - taille, y + taille, x + taille, y - taille);
    noStroke();
  }
}

function drawHelp() {
  noStroke();
  fill(255);

  rect(0, 0, width, 0.48 * height);

  drawHelpButton();
  drawMidiButton();

  let y = dy;
  dy = -0.31 * height;
  factor /= 1.4;
  drawClefs();
  factor *= 1.4;
  dy = y;

  drawPortee();

  var n0;

  /*switch(clef) {
    case 0: n0 = 7*3+5; break;
    case 1: n0 = 7*2;   break;
    case 2: n0 = 7*2+6; break;
  }*/
  n0 = pitchBorder[clef][0];

  for (let n = 0; n < 17; n++) {
    let x = 7 * marge + n * (width - 12 * marge) / 16;
    let note = new Note(n0+n, x);
    //n = n-n0;
    let d = (n + (clef == 0 ? 5 : (clef == 1 ? 7 : 6))) % 7;

    let y = note.getY();
    if (n < 6) {
      y += 2 * marge;
    } else if (n < 9) {
      y += (n - 1) * marge / 2;
    } else if (n < 11) {
      y += (n - 15) * marge / 2;
    } else {
      y -= 2 * marge;
    }

    if (d == button) {
      let c = buttons[d].colour;
      note.setColour(c);
      fill(c);
    } else {
      fill(noir);
    }

    noStroke();
    textAlign(CENTER, CENTER);
    textSize(2 * marge);
    text(degres[d], x, y);

    note.draw();
  }

  for (let d = 0; d < 7; d++) {
    let x = buttons[d].x;
    let y = buttons[d].y + buttons[d].h / 2 + 2.5 * pas;
    noStroke();
    fill(255);
    rect(x - buttons[d].w / 2, y - 1.5 * pas, buttons[d].w, 10 * pas);
    if (d == button) {
      fill(buttons[d].colour);
    } else {
      fill(noir);
    }
    textAlign(CENTER, CENTER);
    textSize(2.6 * marge);
    text(buttons4[d], x, y);
  }
}

function drawMidiButton() {
  noStroke();
  //fill(225);
  fill(colButtons);
  let x = width/2+5*factor;
  let y = height / 15;
  let r = 2.2 * factor;

  noStroke();
  circle(x, y, r);

  imageMode(CENTER);
  image(clavierMidi,x, y, 4*factor, 4*factor);

  if(midi) {
    strokeWeight(factor / 4.6);
    stroke(noir);
    noFill();
    rectMode(CENTER);
    rect(x,y,2.45*factor,2.6*factor)

    rectMode(CORNER);
    noStroke();
  }
}


function drawClefs() {

  noStroke();

  if (!help) {
    textAlign(CENTER, CENTER);
    fill(gris);
    textSize(2 * factor);
    text('Choisis la clef pour commencer :',
      width / 2, 17 * height / 40 - 6 * pas + dy);
  }

  //fill(225);
  fill(colButtons);

  imageMode(CENTER);

  strokeWeight(factor / 4);

  let x, y, r;

  x = width / 2 - 10 * factor;
  y = height / 2 - 1.5 * factor + dy;
  r = 4.2 * factor;

  circle(x, y, r);
  image(clefSol,x, y + factor / 6,
    117 / 25 * factor, 200 / 25 * factor);

  if (help && clef == 0) {
    stroke(noir);
    line(x-r,y-r,x+r,y-r);
    noStroke();
  }

  x = width/2;

  circle(x, y, r);
  image(clefFa, x, y,
    180 / 59 * factor, 200 / 59 * factor);

  if (help && clef == 1) {
    stroke(noir);
    line(x-r,y-r,x+r,y-r);
    noStroke();
  }

  x = width/2 + 10 * factor;

  circle(x, y, r);
  image(clefUt, x, y,
    135 / 50 * factor, 200 / 50 * factor);

  if (help && clef == 2) {
    stroke(noir);
    line(x-r,y-r,x+r,y-r);
    noStroke();
  }
}

function drawPortee() {
  noStroke();
  fill(255);

  let y = height / 2 + 1.6 * dy;

  rect(0, y - 5 * marge, width, 10 * marge);

  stroke(noir);
  strokeWeight(marge / 10);
  line(marge, y - 2 * marge,
    width - marge, y - 2 * marge);
  line(marge, y - marge,
    width - marge, y - marge);
  line(marge, y,
    width - marge, y);
  line(marge, y + marge,
    width - marge, y + marge);
  line(marge, y + 2 * marge,
    width - marge, y + 2 * marge);

  /*if(help) {
    var l;
    switch(clef) {
      case 0:
        l = -1;
        break;
      case 1:
        l = 1;
        break;
      case 2:
        l = 0;
      break;
    }
    strokeWeight(marge/6);
    line(marge,y-l*marge,
       width-marge,y-l*marge);
    strokeWeight(marge/10);
  }*/

  imageMode(CENTER);
  switch (clef) {
    case 0:
      image(clefSol, 3 * marge, y + marge / 6,
        117 / 25 * marge, 200 / 25 * marge);
      break;
    case 1:
      image(clefFa, 3 * marge, y - 0.35 * marge,
        180 / 59 * marge, 200 / 59 * marge);
      break;
    case 2:
      image(clefUt, 3 * marge, y,
        135 / 50 * marge, 200 / 50 * marge);
  }
}

function drawButtons() {
  noStroke();
  fill(255);
  rect(0, 3 * height / 4 - 10 * pas, width, height / 4 + 10 * pas);

  colours = [1, 1, 2, 2, 3, 3, 4, 4];
  var c, cOld;

  for (let d = 0; d < 7; d++) {
    buttons.push(new Button(degres[d]));

    c = floor(random(0, colours.length));
    while (colours[c] == cOld) {
      c = floor(random(0, colours.length));
    }

    buttons[buttons.length - 1].setColour(colours[c]);

    cOld = colours[c];

    colours.splice(c, 1);

    /*noStroke();
    fill(d==button?0:200);
    circle(x,y,3*marge);

    textAlign(CENTER,CENTER);
    textSize(2.6*marge);
    fill(d==button?200:0);
    text(degres[d],width/2-(21-7*d)*marge,3*height/4);*/
  }

  adjustButtons();
}

function adjustButtons() {
  for (let d = 0; d < 7; d++) {
    let x = width / 2 - (21 - 7 * d) * marge;
    let y = 2 * height / 3;

    buttons[d].setPosition(x, y);
    buttons[d].draw(d == button);
  }
}

function drawPseudoButton() {
  noStroke();
  fill(255);
  rect(0, height / 2 - 6 * factor - 9 * pas + dy, width, 12 * factor + 9 * pas);

  textAlign(CENTER, CENTER);
  /*fill(gris);
  textSize(2 * factor);
  text('Presse ENTER pour recommencer',
    width / 2, 17 * height / 40 - 6 * pas + dy);*/

  let decalage = 1.3;

  //fill(225);
  fill(colButtons);
  ellipse(width / 2, height / 2 + decalage*dy, 18 * factor , 9 * factor);

  fill(noir);
  textSize(2 * factor);
  text('Inscris ton nom', width / 2, height / 2 - pas / 2 + decalage*dy);
}

function drawLostButtons() {
  noStroke();
  fill(255);
  rect(0, height / 2 - 6 * factor - 9 * pas + dy, width, 12 * factor + 9 * pas);

  textAlign(CENTER, CENTER);
  /*fill(gris);
  textSize(2 * factor);
  text('Presse ENTER pour recommencer',
    width / 2, 17 * height / 40 - 6 * pas + dy);*/

  let decalage = 1.3;

  //fill(225);
  fill(colButtons);
  circle(width / 2 - 6 * factor, height / 2 + decalage*dy, 4.5 * factor);
  circle(width / 2 + 6 * factor, height / 2 + decalage*dy, 4.5 * factor);

  fill(noir);
  textSize(2 * factor);
  text('Nouvelle\npartie', width / 2 - 6 * factor, height / 2 - pas / 2 + decalage*dy);
  textSize(2 * factor);
  text('Changer\nde clef',
    width / 2 + 6 * factor, height / 2 - pas / 2 + decalage*dy);
}

function checkAnswer() {
  /*if(midi) {

    return;
  }*/

  //let d = (notes[0].pitch + (clef == 0 ? 5 : (clef == 1 ? 7 : 6))) % 7;
  let d = notes[0].pitch%7;

  if (button == d && !hasLost) {
    notes.splice(0, 1);
    nbrn++;
    if(nbrn == highscore+1 && nbrf == 0)
    {
      newRecord = true;
    }
    if (notes.length == 0) {
      notes = [new Note()];
    }
    //vitesse = (Math.log(nbrn/10+2)+0.5)*60/frameRate();
    //vitesse = Math.log(nbrn/10+2)+0.5;
  } else if (button == -1) {
  } else {
    if(!midi) lostMessage = "Perdu ! C'était un ".concat(degres[d],'...');
    //loose();
    nbrf++;
    if(nbrf > nbrn) {
      nbrf = nbrn;
      lostMessage = "Perdu ! Tu as fait trop de fautes...";
      loose();
    }
    else {
      notes.splice(0, 1);
    }
    if (notes.length == 0) {
      notes = [new Note()];
    }
    button = -1;
    cursor(ARROW);
  }
}

function loose() {

  hasLost = true;

  if(newRecord && !pseudoOk && nbrf == 0)
  {
    drawPseudoButton();
    highscore = nbrn;
    pseudo = 'anonyme';
  }
  else
  {
    drawLostButtons();
  }

  noStroke();

  fill(255);

  rect(0, 0, width, height / 3.6);

  drawHelpButton();
  drawMidiButton();

  textAlign(CENTER, CENTER);
  fill(noir);
  textSize(4 * factor);
  //textFont(fontM);

  var str;
  if(newRecord) {
    str = 'Record battu !!';
  } else if (lostMessage != '') {
    str = lostMessage;
  } else {
    str = 'Perdu !';
  }
  text(str, width / 2, height / 4.2);

  fill(gris);
  textFont(fontL);
  textSize(2 * factor);

  textAlign(CENTER, CENTER);
  text('Record :'+' '+highscore+(pseudo=='anonyme'?'':' ( '+pseudo+' )'),
    width / 2 + 0.2*factor, height / 8.2);
  //textAlign(LEFT, CENTER);
  //text(' '+highscore+(pseudo=='anonyme'?'':' ( '+pseudo+' )'),
  //  width / 2 + 0.2*factor, height / 8.2);

  //textAlign(RIGHT, CENTER);
  text('Score :'+' '+nbrn+' ( '+(nbrn?floor(100*(nbrn-nbrf)/nbrn):100)+'% )',
    width / 2 + 0.2*factor, height / 6.3);
  //textAlign(LEFT, CENTER);
  //text(' '+nbrn,
  //  width / 2 + 0.2*factor, height / 6.3);

  //textAlign(CENTER, CENTER);

  button = -1;
  adjustButtons();

  if (nbrn > highscore) {
    //newRecord = true;
  } else {
    noLoop();
  }
}

function restart() {
  noStroke();
  fill(255);
  rect(0, 0, width, height);

  hasLost = false;
  pseudoOk = false;

  adjustButtons();

  //notes = [new Note()];
  nbrn = 0;
  nbrf = 0;
  vitesse = 1.2;
  newRecord = false;
  lostMessage = '';
  window.sessionStorage.removeItem('temp');

  nbrl = 3;

  loop();
}

function refresh() {
  noStroke();
  fill(255);
  rect(0,0,width,height);

  if (help) {
    drawHelp();
    adjustButtons();
  } else if (!hasBegun) {
    setup();
    draw();
  } else if (!hasLost) {
    adjustButtons();
    for (let n = 0; n < notes.length; n++) {
      notes[n].adjustY();
    }
  } else {
    loose();
  }
  cursor(ARROW);
}

function setMarge() {
  if (width / height > 2.8) {
    marge = width / 250;
  } else if (height > width) {
    marge = width / 53;
  } else {
    marge = width / 150;
    marge = width / 120;
  }
  pas = height / 150;
  dy = -15 * pas;
  factor = sqrt(pow(marge + pas, 2), pow(marge + pas, 2)) / 1.5;
}

//var myUrl = 'https://www.cmne.ch/index.php?id=321&type=101&act=';

var response;

function gotData(data) {
  if(data != null)
  {
    highscore = data['0'].score;
    pseudo    = data['0'].pseudo;
  } else {
    console.log('erreur lors du chargement du highscore')
    highscore = 249;
    pseudo    = Mozart;
  }
}

function preload() {
  //loadJSON(myUrl+'listscore&g=1',gotData);

  clefSol = loadImage('clef_sol.png');
  clefFa = loadImage('clef_fa.png');
  clefUt = loadImage('clef_ut.png');

  clavierMidi = loadImage('clavier_midi.png');

  fontM = loadFont('medium.otf');
  fontL = loadFont('light.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //createCanvas(400,400);

  textFont(fontL);
  strokeCap(SQUARE);

  setMarge();

  frameRate(60);

  background(255);

  //notes = [new Note()];
  nbrn = 0;
  vitesse = 1.2;
  newRecord = false;
  pseudoOk = false;

  if (buttons.length == 0) {
    drawButtons();
  } else {
    adjustButtons();
  }

  noStroke();

  fill(gris);
  textSize(2 * factor);

  textAlign(CENTER,CENTER);
  text('Record :'+' '+highscore+(pseudo=='anonyme'?'':' ( '+pseudo+' )'),
       width / 2 + 0.2*factor, height / 8.2);
  //textAlign(LEFT,CENTER);
  //text(' '+highscore+(pseudo=='anonyme'?'':' ( '+pseudo+' )'),
  //     width / 2 + 0.2*factor, height / 8.2);

  //textAlign(CENTER, CENTER);

  fill(noir);
  textSize(6 * factor);
  //textFont(fontM);
  text('Acceleranotes', width / 2, height / 5.3);
  textFont(fontL);

  drawHelpButton();
  drawMidiButton();

  drawClefs();

  noStroke();
  textSize(1.8 * marge);
  fill(noir);

  for (let d = 0; d < 7; d++) {
    let x = width / 2 - (15 - 5 * d) * marge;
    let y = 3 * height / 4;

    //text(buttons4[d],width/2-(21-7*d)*marge,y-4*marge);
  }

  //text('ou',width/2,25.5*height/40);

  noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  background(255);

  noStroke();
  fill(255);
  rect(0, 0, width, height);

  setMarge();

  /*if (help) {
    drawHelp();
  } else if (!hasBegun) {
    setup();
    draw();
  } else if (!hasLost) {
    for (let n = 0; n < notes.length; n++) {
      notes[n].adjustY();
    }
  } else {
    loose(false);
  }*/

  refresh();
}

var fps, difficulty, limit;

function draw() {

  fps = frameRate();
  if (fps > 10) {
    difficulty = (Math.log(nbrn / 5 + 2) + 0.5);
    vitesse = 0.05 * difficulty * (width - 7 * marge) / fps;
  }

  //frameRate(60);
  /*noStroke();
  fill(255);
  rect(0,0,100,100);
  fill(noir);
  textSize(10);
  text(displayDensity(),10,5);*/

  /*if (help) {
    if (button != -1 && millis() - time > 1000) {
      button = -1;
      //adjustButtons();
      refresh();
      //drawHelp();
    }
  } else {
    */if (button != -1 && millis() - time > 200) {
      checkAnswer();
      button = -1;
      adjustButtons();
    }
  //}

  if (hasBegun && !hasLost && !help) {

    noStroke();
    fill(255);
    rect(0, 6 * height / 40 - 2 * marge, width, 4 * marge);
    fill(noir);
    textSize(3 * factor);
    textAlign(CENTER, CENTER);
    text('Score :'+' '+nbrn+' ( '+(nbrn?floor(100*(nbrn-nbrf)/nbrn):100)+'% )',
         width / 2, 6 * height / 40);
    /*textAlign(LEFT, CENTER);
    text(' '+nbrn,
         width / 2 + 0.2*factor, 6 * height / 40);*/

    //textAlign(CENTER, CENTER);

    drawPortee();

    for (let n = 0; n < notes.length; n++) {
      notes[n].move(vitesse);
      notes[n].draw();
    }

    if (notes[notes.length - 1].position() < 5 * marge + 8.5 * (width - 7 * marge) / 10) {
      notes.push(new Note());
    }

    if (notes[0].position() < 5 * marge) { // a atteint la clef
      //notes.splice(0,1);
      if (button != -1) {
        checkAnswer();
      } else if (!hasLost){
        lostMessage = '';
        loose();
        myTime = millis();
      }
    }
  }

  if (hasLost && newRecord && millis() - time > 300) {
    noLoop();
  }
}

function mousePressed() {
  if ((hasBegun && !hasLost) || help) { // buttons
    if (button != -1 && !help) {
      checkAnswer();
    }
    for (let d = 0; d < 7; d++) {
      let xMin = buttons[d].getX();
      let xMax = buttons[d].w + xMin;
      let yMin = buttons[d].getY();
      let yMax = buttons[d].h + yMin;

      if (mouseX > xMin && mouseX <= xMax &&
        mouseY > yMin && mouseY <= yMax) {
        button = d;
        adjustButtons();
        time = millis();
        if (help) {
          //drawHelp();
          refresh();
        } else {
          notes[0].setColour(buttons[d].colour);
        }
      }
    }

    if (help) { // help clefs
      var ymem = dy;
      dy = -0.31 * height;
      factor /= 1.4;
      for (let c = 0; c < 3; c++) {
        let x = width / 2 - (10 - 10 * c) * factor;
        let y = height / 2 - 1.5 * factor + dy;
        let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));

        if (dist <= 4.2 * factor) {
          cursor(ARROW);
          clef = c;
          if(!midi) {
            /*switch(clef) {
              case 0:
                pitchMin = 7*3+5;
                //middlePitch = 7*4+6;
                pitchMax = 7*6;
                break;
              case 1:
                pitchMin = 7*2;
                //middlePitch = 7*3+1;
                pitchMax = 7*4+2;
                break;
              case 2:
                pitchMin = 7*2+6;
                //middlePitch = 7*4;
                pitchMax = 7*5+1;
                break;
            }*/
            pitchMin = pitchBorder[clef][0];
            pitchMax = pitchBorder[clef][2];
          }
          notes = [new Note()];
          factor *= 1.4;
          dy = ymem;
          //drawHelp();
          refresh();
          return;
        }
      }
      factor *= 1.4;
      dy = ymem;
    }
  } else if (!hasBegun) { // clefs
    for (let c = 0; c < 3; c++) {
      let x = width / 2 - (10 - 10 * c) * factor;
      let y = height / 2 - 1.5 * factor + dy;
      let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));

      if (dist <= 4.2 * factor) {
        cursor(ARROW);
        clef = c;
        if(!midi) {
          /*switch(clef) {
            case 0:
              pitchMin = 7*3+5;
              //middlePitch = 7*4+6;
              pitchMax = 7*6;
              break;
            case 1:
              pitchMin = 7*2;
              //middlePitch = 7*3+1;
              pitchMax = 7*4+2;
              break;
            case 2:
              pitchMin = 7*2+6;
              //middlePitch = 7*4;
              pitchMax = 7*5+1;
              break;
          }*/
          pitchMin = pitchBorder[clef][0];
          pitchMax = pitchBorder[clef][2];
        }
        notes = [new Note()];
        noStroke();
        fill(255);
        rect(0, 0, width, height);
        adjustButtons();
        hasBegun = true;
        loop();
      }
    }
  }
  else if (hasLost) {
    if(!newRecord || pseudoOk) // lost buttons
    {
      let x = width / 2 - 6 * factor;
      let y = height / 2 + 1.3*dy;
      let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));
      if (dist <= 4.5 * factor) {
        cursor(ARROW);
        notes = [new Note()];
        restart();
        //refresh();
      }

      x = width / 2 + 6 * factor;
      dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));
      if (dist <= 5 * factor) {
        cursor(ARROW);
        hasBegun = false;
        hasLost = false;
        //setup();
        refresh();
      }
    }
    else // pseudo button
    {
      let x = width / 2;
      let y = height / 2 + 1.3*dy;
      let dist = pow(x-mouseX,2)/pow(9*factor,2)+
                 pow(y-mouseY,2)/pow(4.5*factor,2);
      if (dist <= 1)
      {
        cursor(ARROW);

        pseudo = window.prompt('Inscris ton nom :');

        if (pseudo == null ||
            pseudo == '' ||
            pseudo == 'null') {
          pseudo = 'anonyme';
        }
        else
        {
          pseudoOk = true;
        }
        loose();
      }
      var i;

      /*while(httpGet(myUrl+'setscore&g=1&s='+highscore+'&p='+pseudo) == null)
      {
        i++;
        if(i > 1000)
        {
          console.log("erreur lors de l'upload du highscore");
          break;
        }
      }*/
      refresh();
    }
  }

  if (!hasBegun || hasLost || help) { // help button
    let x =  width/2-5*factor;
    let y = height / 15;
    let r = 2.2 * factor;
    let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));

    if (dist <= r) {
      if (help) {
        help = false;
        //hasBegun = false;
        //hasLost = false;
        //setup();
        button = -1;
        refresh();
      } else {
        help = true;
        //drawHelp();
        refresh();
      }
    }
  }

  if (!hasBegun || hasLost || help) { // midi button
    let x = width/2+5*factor;
    let y = height / 15;
    let r = 2.2 * factor;
    let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));

    if (dist <= r) {
      if (midi) {
        disableMidi();
      } else {
        enableMidi();
        refresh();
      }
    }
  }

  return false;
}

function mouseMoved() {
  cursor(ARROW);
  if ((hasBegun && !hasLost) || help) { // buttons
    for (let d = 0; d < 7; d++) {
      let xMin = buttons[d].getX();
      let xMax = buttons[d].w + xMin;
      let yMin = buttons[d].getY();
      let yMax = buttons[d].h + yMin;

      if (mouseX > xMin && mouseX <= xMax &&
        mouseY > yMin && mouseY <= yMax) {
        cursor(HAND);
      }
    }

    if (help) { // help clefs
      var ymem = dy;
      dy = -0.31 * height;
      factor /= 1.4;
      for (let c = 0; c < 3; c++) {
        let x = width / 2 - (10 - 10 * c) * factor;
        let y = height / 2 - 1.5 * factor + dy;
        let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));

        if (dist <= 4.2 * factor) {
          factor *= 1.4;
          dy = ymem;
          cursor(HAND);
          return;
        }
      }
      factor *= 1.4;
      dy = ymem;
    }
  } else if (!hasBegun) { // clefs
    for (let c = 0; c < 3; c++) {
      let x = width / 2 - (10 - 10 * c) * factor;
      let y = height / 2 - 1.5 * factor + dy;
      let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));

      if (dist <= 4.2 * factor) {
        cursor(HAND);
      }
    }
  }
  else if (hasLost) {
    if(!newRecord || pseudoOk) // lost buttons
    {
      let x = width / 2 - 6 * factor;
      let y = height / 2 + 1.3*dy;
      let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));
      if (dist <= 4.5 * factor) {
        cursor(HAND);
      }

      x = width / 2 + 6 * factor;
      dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));
      if (dist <= 5 * factor) {
        cursor(HAND);
      }
    }
    else // pseudo button
    {
      let x = width / 2;
      let y = height / 2 + 1.3*dy;
      let dist = pow(x-mouseX,2)/pow(9*factor,2)+
                 pow(y-mouseY,2)/pow(4.5*factor,2);
      if (dist <= 1) {
        cursor(HAND);
      }
    }
  }

  if (!hasBegun || hasLost || help) { // help button
    let x = width/2-5*factor;
    let y = height / 15;
    let r = 2.2 * factor;
    let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));

    if (dist <= r) {
      if (help) {
        cursor(HAND);
      } else {
        cursor(HAND);
      }
    }
  }

  if (!hasBegun || hasLost || help) { // midi button
    let x = width/2+5*factor;
    let y = height / 15;
    let r = 2.2 * factor;
    let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));

    if (dist <= r) {
      if (help) {
        cursor(HAND);
      } else {
        cursor(HAND);
      }
    }
  }

  return false;
}

function mouseReleased() {
  if (help && button != -1) {
    button = -1;
    refresh();
  }
}

function keyPressed() {

  if (button != -1 && !help) {
    checkAnswer();
  }

  //console.log(keyCode);

  switch (keyCode) {
    //case 49:
    //case 81:
    //case 65:
    case 90:
    case 89:
      button = 0;
      break;
    //case 50:
    //case 87:
    //case 83:
    case 88:
      button = 1;
      break;
    //case 51:
    //case 69:
    //case 68:
    case 67:
      button = 2;
      break;
    //case 52:
    //case 82:
    //case 70:
    case 86:
      button = 3;
      break;
    //case 53:
    //case 84:
    //case 71:
    case 66:
      button = 4;
      break;
    //case 54:
    //case 90:
    //case 72:
    case 78:
      button = 5;
      break;
    //case 55:
    //case 85:
    //case 74:
    case 77:
      button = 6;
      break;
    case 13:
      if (hasLost && (!newRecord || pseudoOk)) {
        restart();
        //refresh();
      }
  }

  if (((!hasLost && hasBegun) || help) && button != -1) {
    adjustButtons();
    time = millis();
    if (help) {
      //drawHelp();
      refresh();
    } else {
      notes[0].setColour(buttons[button].colour);
    }
  } else {
    button = -1;
  }

  return false;
}

function keyReleased() {
  if (help && button != -1) {
    button = -1;
    refresh();
  }
  //A5.play();
}

var noteOnCounter;

function enableMidi() {
  midi = true;

  WebMidi.enable(function (err) {
    if (err) console.log("An error occurred", err);

    var liste = '';
    var taille = WebMidi.inputs.length;
    var i, num;
    var numStr = '0';

    for(let i = 0; i < taille; i++) {
      num = i+1;
      liste += num.toString() + ' - ' + WebMidi.inputs[i].name + '\n';
    }

    //console.log(liste);

    i = 0;
    num = 0;

    while((num < 1 || num > taille) && i < 3) {
      numStr = window.prompt("Écris le numéro de l'appareil désiré :\n"+liste);
      if(numStr == null)
      {
        num = 0;
        break;
      }
      else if(numStr) num = parseInt(numStr);
      i++;
    }

    if(num < 0 || !num || num > taille) {
      disableMidi();
    }
    else {
      noteOnCounter = 0;
      var input = WebMidi.inputs[num-1];
      console.log('input : ',input.name);
      if(!input.hasListener('noteon', 'all', handleNoteOn)) {
        console.log("il est libre !");
        input.addListener('noteon', 'all', handleNoteOn);
        input.addListener('noteoff', 'all', handleNoteOff);
      }
      window.alert("Joue la note la plus basse sur ton instrument MIDI, puis la note la plus aigüe.");
    }
  },true);
}

var pitchMinStr;

function handleNoteOn(e) {
  if((!hasBegun || hasLost) && !help && noteOnCounter >= 2) return;
  if (button != -1 && !help) {
    checkAnswer();
  }

  var pitch = e.note.number;
  var octave = e.note.octave;
  var pitchClass = pitch%12;
  var degree;
  switch(pitchClass){
    case 0: degree = 0; break;
    //case 1:
    case 2: degree = 1; break;
    //case 3:
    case 4: degree = 2; break;
    case 5: degree = 3; break;
    //case 6:
    case 7: degree = 4; break;
    //case 8:
    case 9: degree = 5; break;
    //case 10:
    case 11: degree = 6; break;
    default: return;
  }

  pitch = 7*octave+degree;

  if(noteOnCounter < 2) {
    //console.log("noteOnCounter : "+noteOnCounter);
    switch(noteOnCounter) {
      case 0: pitchMin = pitch;
              pitchMinStr = e.note.name+octave;
              break;
      case 1: if(pitch == pitchMin) return;
              pitchMax = pitch;
              window.alert("Notes utilisées : "+pitchMinStr+" - "+e.note.name+octave);
    }
    noteOnCounter++;
    return;
  }

  var deg;
  if(help) {
    button = degree;
    refresh();
    return;
  }
  else if(hasBegun && !hasLost) {
    deg = notes[0].pitch%7;
  }
  else {
    return;
  }

  //if(degree >= 0) {
    /*switch(clef) {
      case 0: pitch = degree-5+7*(octave-3); break;
      case 1: pitch = degree-6+7*(octave-2); break;
      case 2: pitch = degree  +7*(octave-2); break;
    }*/

      console.log('note : ',pitch);
      if(pitch == notes[0].pitch) {
        button = deg;
      }
      else
        button = (deg+1)%7;

      adjustButtons();
      time = millis();

      notes[0].setColour(buttons[degree].colour);
  //}

  if(deg == degree)
    lostMessage = 'Perdu ! Mauvaise octave...';
  else
    lostMessage = "Perdu ! C'était un ".concat(degres[deg],'...');
}

function handleNoteOff(e) {
  if (help && button != -1) {
    button = -1;
    refresh();
  }
}

function disableMidi() {
  midi = false;

  for(let i = 0; i < WebMidi.inputs.length; i++) {
    WebMidi.inputs[i].removeListener();
  }

  WebMidi.disable();

  refresh();
}
