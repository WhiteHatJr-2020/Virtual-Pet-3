var dog,dogImg,dogImg1;
var database;
var foodS,foodStock, fedTime,lastFed, foodObj;

function preload()
{
   dogImg=loadImage("virtual pet images/dogImg.png");
   dogImg1=loadImage("virtual pet images/dogImg1.png");
   bedroomImage=loadImage("virtual pet images/Bed Room.png");
   gardenImage=loadImage("virtual pet images/Garden.png");
   washroomImage=loadImage("virtual pet images/Wash Room.png");
  }


function setup() 
{
  database=firebase.database();
  createCanvas(400,500);

  foodObj=new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  //console.log(foodStock)

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data)
  {
    lastFed=data.val();
  });

  readState=database.ref('gameState');
  readState.on("value",function(data)
  {
    gameState=data.val();
  })
  
  dog=createSprite(200,400,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  feed=createButton("Feed the dog");
  feed.position(450,105);
  feed.mousePressed(feeddog);

  addFood=createButton("Add Food");
  addFood.position(550,105);
  addFood.mousePressed(addfood);

}

function draw() 
{
  currentTime=hour();
  if(currentTime == (lastFed+1))
  {
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime == (lastFed+2))
  {
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4))
  {
    update("Bathing");
    foodObj.washroom();
  }
  else
  {
    update("Hungry");
    foodObj.display();
    //console.log("World")
  }

  if(gameState!="Hungry")
  {
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else
  {
    feed.show();
    addFood.show();
    dog.addImage(dogImg1);
  }

  drawSprites();
}

function addfood()
{
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feeddog()
{
  dog.addImage(dogImg);
  console.log("Hello")
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update(
    {
      Food:foodObj.getFoodStock(),
      FeedTime:hour(),
      gameState:"Hungry"
    }
  )
}

function readStock(data)
{
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
  //console.log(foodS)
}

function update(state)
{
  database.ref('/').update({
    gameState: state
  });
}
