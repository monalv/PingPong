/*
 * A player wins a game if me makes 20 points.	
 * A player can add a new ball on click of add button
 * The color change of the paddle is kept at 15 minutes. Since there will not be a frequent change in the temperature.  
*/


var maxScore=100; //set the Max score for a player to win
var p1,p2,ball,ball2; //3 elements of the game
var winner=""; //holds the winner 
var cnt=60000;
var state = false; //state indicates whether play or pause is clicked. state = true is play.
var windowW = 1300,windowH = 800,windowWOuter = 1300,windowHOuter = 800; //size of the canvas
var ballsArray=new Array();
var dispArray= [2,3]; //displacement array. 
var colorArray= ["green","red"];

//Paddle Class
var Paddle = function(name){
	this.name=name;
 
	//the amount of paddle movement
	this.maxDisplace = 2; 
	
	//score for this player
	this.score = 0;
	 
	//Direction of movement
	this.down = false; 
	this.up = false;   

	//Dimensions of paddle
	this.width=0;  
	this.height=0;
	this.top=0;
	this.left=0;

	this.draw= function(){	 
		//if the paddle is moving down		
		if(this.down && (this.top+this.height+5) < windowH){
			this.top += this.maxDisplace;
		}
		
		//if the paddle is up
		if(this.up && (this.top-5)>0){
			this.top -= this.maxDisplace;
		}	 
		
		$("#"+this.name).css("width",this.width).css("height",this.height).css("top",this.top).css("left",this.left);
	};

};

//Ball Class
var Ball = function(name,d1,d2,color){
	this.name=name;
 
	this.xDisplace = d1;//x displacement 
	this.yDisplace = d2;//y displacement
 
	//dimensions
	this.width=0;
    this.height=0;
	this.top=0;
	this.left=0;
 
	this.draw = function(){
	
		
		//if top or bottom is touched
		if((this.top+this.height+10) > windowH || this.top < 5){  
			this.yDisplace = -this.yDisplace;
		}
		
		
		//if the left boundary is touched
		if(this.left < 5 ){
			p2.score +=10;
			this.xDisplace = Math.abs(this.xDisplace); 
			if(p2.score==maxScore) 
				winner="2";  
		}
		
		
		//if the right boundary is touched
		if(this.left + this.width >windowW-5){
			p1.score +=10;
			this.xDisplace = -Math.abs(this.xDisplace);
			if(p1.score==maxScore) 
				winner="1";  
		 }
		 
		this.left += this.xDisplace;
		this.top  += this.yDisplace;
		 
		$("#"+this.name).css("width",this.width).css("height",this.height).css("top",this.top).css("left",this.left).css("background-color",color); 
	};
};

//timeinterval is set to 15 ms
var timeInterval = function(callback){
       window.setTimeout(callback,1000/60);
};
	  
function addBall(){

	var d1; //displacement1
	var d2; //displacement1
	var color; //color
	
	//new dom element for added ball
	var ballName="ball"+ballsArray.length+1;
	var newD = $("<div></div>").attr('id',ballName).appendTo('#allBalls');
	newD.addClass("balls");
	
	//alternating directions and color for every added ball
	if((ballsArray.length+1) % 2 == 0){
			d1=dispArray[0];
			d2=d1+1;
			color=colorArray[0];
	}
	else{	
			d1=dispArray[1];
			d2=d1+1;
			color=colorArray[1];	
	}
	
	//new ball object
	var newBall=new Ball(ballName,3,3,color);
	//placement for the new ball object
	newBall.top=(windowH/2)-(p1.height/2);	
	newBall.height = newBall.width = windowH*6/100;	
	newBall.top=(windowH/2)-(newBall.height/2);
	newBall.left=(windowW/2)-(newBall.width/2); 
	//pushing into ballsArray
	ballsArray.push(newBall);
} 
$(document).ready(function(e) {
	//new instances
	p1 = new Paddle("p1");
	p2 = new Paddle("p2");
	ball = new Ball("ball",3,4,"red");   
	ballsArray.push(ball);
	placeElements(); 
	$(document).bind('keydown',isKeyDown);   
	$(document).bind('keyup',isKeyUp);   
	animate();
});

//checks of the player has won
//If not then it draws elements periodically to show animation
function animate(){
	if(winner!=""){ //If a player already wins
	    $("#win").html("<b>Player "+winner+" wins !</b>");
		$("#win").css("color","red");		
		winner="";
		state = !state; 
		$("#gameState").val("Play"); 
		reset();		
	}	    
	else{
		if(state){ //play
			drawElements();
        }
        timeInterval(animate); 
	}
}

//Calculate the positions of the elements 		
function placeElements(){
	windowWOuter = windowW;
	windowHOuter = windowH;
	windowW = window.innerWidth;
	windowH = window.innerHeight;
	p1.width = windowW*1/100;
	p1.height = windowH*15/100;
	p2.width = windowW*1/100;
	p2.height = windowH*15/100;
	p1.top = p2.top = ball.top =(windowH/2)-(p1.height/2);
	p1.left = 0;
	p2.left = windowW - p2.width;

	//placing all the balls objects in the ballsArray
	for(var i=0;i<ballsArray.length;i++){
		ballsArray[i].top=(windowH/2)-(p1.height/2);	
		ballsArray[i].height = ballsArray[i].width = windowH*6/100;	
		ballsArray[i].top=(windowH/2)-(ballsArray[i].height/2);
		ballsArray[i].left=(windowW/2)-(ballsArray[i].width/2); 
	}	
	drawElements();
}

//Check if the ball touches the paddles or the boundaries		
function Rebound(){

	//Checking for all Balls objects in ballsArray
	for(var i=0;i<ballsArray.length;i++){
		if(( ballsArray[i].left + ballsArray[i].width ) > p2.left || ballsArray[i].left < (p1.left + p1.width)){
			if((ballsArray[i].top > p1.top && ballsArray[i].top < p1.top + p1.height)||(ballsArray[i].top + ballsArray[i].height > p1.top && ballsArray[i].top + ballsArray[i].height < p1.top + p1.height)||(ballsArray[i].top > p2.top && ballsArray[i].top < p2.top + p2.height)||(ballsArray[i].top + ballsArray[i].height > p2.top && ballsArray[i].top + ballsArray[i].height < p2.top + p2.height))
			ballsArray[i].xDisplace = -ballsArray[i].xDisplace; 
		}
	}
}

//drawing of the elements (this function called every 15 ms) 
function drawElements(){
	if(cnt==60000){ //every 15 minutes
		console.log("get weather : "); 
		getWeather();
		cnt=0;
	}  
	cnt++;
	Rebound();
	
	//drawing all objects in ballsArray
	for(var i=0;i<ballsArray.length;i++){
		ballsArray[i].draw();
	}
	p1.draw();
	p2.draw();
	updateScore();
}

//On restart of the game when a player wins and play is clicked again
function reset(){
	$(".balls").remove();	//to remove the added divs for the new balls
	ballsArray.length=0;    //Clear the array
	p1 = new Paddle("p1");  //reset the paddle
	p2 = new Paddle("p2");
	ball = new Ball("ball",3,4,"red");
	ballsArray.push(ball); 
	placeElements();
	animate();
}

//update the score periodically
function updateScore(){
//console.log("update "+p1.score+'   Player2 : '+p2.score);
  $("#score1").html(p1.score);
  $("#score2").html(p2.score);
}

//setting the actions for the key presses
//Q and A for player 1 
//Up arrow and Down arrow for player 2
function isKeyDown(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 ){//up arrow
		e.preventDefault();
		p2.up = true;
	}
    if (keyID === 40){//down arrow
		e.preventDefault();
		p2.down = true;
    }	
	if( keyID === 81) {  //Q key
        e.preventDefault();
        p1.up = true;
    }
	if(keyID === 65) { // A key
        e.preventDefault();
       p1.down = true;
    }
}
function isKeyUp(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 ){//up arrow
		e.preventDefault();
		p2.up = false;
	}
    if (keyID === 40){//down arrow
		e.preventDefault();
		p2.down = false;
    }	
	if( keyID === 81) {  //Q key
        e.preventDefault();
        p1.up = false;
    }
	if(keyID === 65) { // A key
		e.preventDefault();
		p1.down = false;
    }
}

/*When user clicks on play/pause button this function is called.*/
function stateClicked(){
 state = !state; 
 $("#win").html("Score Board");
 $("#win").css("color","#C2C2C2");
			
 if(state)
	$("#gameState").val("Pause");
 else{
	$("#gameState").val("Play"); }
}

//This function is called periodically 
function getWeather() {
	var url = 'http://api.openweathermap.org/data/2.5/forecast?id=5368361'; //request to OpenWeather API 
	// id = 5368361 (city id for Los Angeles is this)
	$.ajax({
	    dataType: "jsonp",
	    url: url,
	    jsonCallback: 'jsonp',
	    //data: { units:"metric" },
	    cache: false,
	    success: function (data) {
			var arr = data.list;
		//	console.log("temperature in kelvin : "+arr[0].main.temp);
	    	paddleColor(arr[0].main.temp); //The data received in degree kelvin
	    }
	});
}	
	
// logic for changing the paddle colors
//for lower temperatures it shows light yellow and green paddle colors
//as the temperature increases it shows darker shades of yellow and green

function paddleColor(temp){
	//if temperature is less than 15 deg celcius
	if(convertTemperature(temp)>15){		
		//if temperature is between 15 to 25 deg celcius
		if(convertTemperature(temp)>15 && convertTemperature(temp)<25){
			$("#p2").css("background-color","#00CC00");
			$("#p1").css("background-color","#FFCC00");		
	     	console.log("in between 15 to 25");
	
		}		
		//if temperature is greater than 25 deg celcius
		else{ 
			$("#p2").css("background-color","#003300");
			$("#p1").css("background-color","#CC6600");		
	   		console.log("> 25");	
		}
	}
	else{	
		//if temperature is between 10 to 15 deg celcius
		if(convertTemperature(temp)>10 && convertTemperature(temp)<15){
			$("#p2").css("background-color","#99FF66");
			$("#p1").css("background-color","#FFE680");			
			console.log("in between 10 to 15");
		}		
		//if temperature is less than 10		
		else{			
			$("#p2").css("background-color","#CCFFCC");
			$("#p1").css("background-color","#FFFF66");	
			console.log("< 15");
				
		}
	}
}	


//extra function to convert temp from kelvin to farenheit		
function convertTemperature(kelvin){
		console.log("converted (deg celcius): "+(kelvin - 273.15));
		return Math.round((kelvin - 273.15));
}



