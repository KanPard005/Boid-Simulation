let n=200, avoidrange=10, alignrange=100, centerrange=100, centerwt=0.1, avoidwt=0.5, alignwt=0.4, maxvel=5;

class Bird {
  constructor(x, y, xv, yv) {
    this.loc=createVector(x, y);
    this.vel=createVector(xv, yv);
  }

  howfar(b) {
    return this.loc.copy().sub(b.loc).mag();
  }

  makeBird(c) {
    fill(c);
    noStroke();
    circle(this.loc.x, this.loc.y, 10);
  }

  updateloc() {
    this.loc.add(this.vel);
    if (this.loc.x<0)  this.loc.x+=windowWidth;
    else if(this.loc.x>windowWidth) this.loc.x-=windowWidth;
    if (this.loc.y<0)  this.loc.y+=windowHeight;
    else if(this.loc.y>windowHeight) this.loc.y-=windowHeight;
  }

  velalign(blist) {
    let upd=createVector(0, 0);
    blist.forEach((b) => {
      if (this.howfar(b)<=alignrange && b!=this) upd.add(b.vel);
    });
    return upd.normalize();
  }

  tocenter(blist) {
    let avg=createVector(0, 0);
    blist.forEach((b) => {
      if (this.howfar(b)<=centerrange && b!=this) avg.add(b.loc.copy().sub(this.loc));
    });
    return avg.normalize();
  }

  avoidcol(blist) {
    let avoid=createVector(0, 0);
    blist.forEach((b) => {
      if (this.howfar(b)<=avoidrange && b!=this) avoid.add(this.loc.copy().sub(b.loc).normalize());
    });
    return avoid.normalize();
  }

  updatevel(blist) {
    let upd=this.velalign(blist).mult(alignwt);
    let avg=this.tocenter(blist).mult(centerwt);
    let avoid=this.avoidcol(blist).mult(avoidwt);
    upd.add(avg);
    upd.add(avoid);
    this.vel.add(upd);
    if (this.vel.mag()>maxvel) this.vel.normalize().mult(maxvel);
  }
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  initiate(windowWidth,windowHeight);
}

let birds=[];
function initiate(width, height) {
  for(let i=0; i<n; i++) {
      let x=Math.random()*width;
      let y=Math.random()*height;
      let xv=-5+Math.random()*10;
      let yv=-5+Math.random()*10;
      b=new Bird(x, y, xv, yv);
      birds.push(b);
  }
}

function draw() {
  background(0);
  let c=color(255,204,0);
  birds.forEach((b) => {
    b.updateloc();
    b.makeBird(c);
    b.updatevel(birds);
    if (Math.random()*1000<1) {
      b.vel.x=-5+10*Math.random();
      b.vel.y=-5+10*Math.random();
    }
  });
}