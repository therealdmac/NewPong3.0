function vector(a,b) {
	//vector expressed as (i,j)
	this.i = a;
	this.j = b;
	
	//Adds a vector
	this.add = function(v){
		return new vector(this.i + v.i,	this.j + v.j);
	}
	//Adds a vector
	this.addn = function(x,y){
		return new vector(this.i + x,	this.j + y);
	}
	//Subtracts a vector
	this.sub = function(v){
		return new vector(this.i - v.i,	this.j - v.j);
	}
	//Subtracts a vector
	this.subn = function(x,y){
		return new vector(this.i - x,	this.j - y);
	}
	//Computes the dot product
	this.dotProduct = function(v){
		return this.i * v.j - this.j * v.i;
	}
	//Computes magnitude of the vector
	this.magnitude = function(){
		return Math.sqrt(this.i*this.i + this.j*this.j);
	}
	//Returns a normalised vector
	this.normalise = function(){
		var n = 1/this.magnitude();
		return v = new vector(n*this.i,n*this.j);
	}
	//Returns a perpendicular vector
	this.perp = function(){
		return new vector(-this.j, this.i);
	}
	//Prints vector as a string
	this.toString = function(){
		return "Vector("+this.i+", "+this.j+")\n";
	}
}
