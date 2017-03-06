var i=0,
    image=new Image(),
    fileinput=document.getElementById('fileinput'),
    display=document.getElementById('photoHolder'),
    ctx = display.getContext('2d'),storeProps=[],mouseX,mouseY,
    canvasOffset = $("#photoHolder").offset(),offsetCanvasX=canvasOffset.left,
    offsetCanvasY=canvasOffset.top,clickToBeDragged=0,isClicked=false,
    scalMode=false,tmp=0,tmp2=0;
display.width=500,display.height=400;

function displayPic(){
    fileinput.addEventListener('change',function(e){
			var reader=new FileReader();
			reader.onload=function(e){
				image.addEventListener('load',function(){
                    var wrh = image.width / image.height;
                    newWidth = display.width;
                    newHeight = newWidth / wrh;
                    if (newHeight > display.height) {
                        newHeight = display.height;
                        newWidth = newHeight * wrh;
                    }
            ctx.clearRect(0,0,display.width,display.height);
            ctx.drawImage(image,0,0, newWidth , newHeight);
            storeProps.length=0;
				});
				image.src=reader.result;
			}
			reader.readAsDataURL(fileinput.files[i]);
		});
}
function showProps(){
    var objects =['images/1.svg','images/2.svg','images/3.svg','images/4.svg','images/5.svg'];
	for (var i = 0; i < objects.length; i++) {
		$('<img src="'+ objects[i] +'" id = "objects"/>').data('number',i).appendTo('#props');
	}
}
function drawProps(){
    var propObj = document.querySelectorAll('#objects');
    for(var i = 0; i < propObj.length; i++){
        var links = propObj[i];
        links.addEventListener('click',function(e){
            document.getElementById("rotation").disabled=true;
            document.getElementById("scalingW").disabled=true;
            document.getElementById("scalingH").disabled=true;
            document.getElementById("remove").disabled=true;
            var ix=Math.round(Math.random()*200),
            iy=Math.round(Math.random()*300);
            ctx.drawImage(this,ix,iy,50,50);
            storeProps.push({
                src:this,
                x:ix,
                y:iy,
                w:50,
                h:50,
                angle:0
            });
        },false);
    }
}
function propsOnClick(e){
    e.preventDefault();
    e.stopPropagation();
    
    mouseX=(e.clientX-offsetCanvasX);
    mouseY=(e.clientY-offsetCanvasY);
    
    var clicked = -1;
    for(var i = 0;i<storeProps.length;i++){
        var prop = storeProps[i],
            dx = mouseX,
            dy = mouseY;
            if(dx>prop.x && dx<prop.x+prop.w && dy>prop.y && dy<prop.y+prop.h){
                clicked=i;
                clickToBeDragged=storeProps[clicked];
                isClicked=true;
                document.getElementById("rotation").disabled=false;
                //document.getElementById("rotation").value=clickToBeDragged.angle;
                document.getElementById("scalingW").disabled=false;
                document.getElementById("scalingW").value = clickToBeDragged.w;
                document.getElementById("scalingH").disabled=false;
                document.getElementById("scalingH").value=clickToBeDragged.h;
                document.getElementById("remove").disabled=false;
                $("#scalingW").on('change mousemove',function(){
                    incrW(clickToBeDragged);
                })
                $("#scalingH").on('change mousemove',function(){
                    incrH(clickToBeDragged);
                })
                $("#rotation").on('change mousemove',function(){
                    rotateProps(clickToBeDragged);
                })
                $("#remove").on('mousedown',function(){
                    deleteProps(clickToBeDragged);
                })
            }
    }
}
function propsOnDrag(e){
    if(!isClicked){
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    
    var currentX=e.clientX-offsetCanvasX;
    var currentY=e.clientY-offsetCanvasY;
    var dx = currentX-mouseX;
    var dy = currentY-mouseY;
    
    mouseX = currentX;
    mouseY = currentY;
    
    clickToBeDragged.x+=dx;
    clickToBeDragged.y+=dy;

    redraw();
}
function MouseUp(e){
    e.preventDefault();
    e.stopPropagation();
    isClicked=false;
}
function redraw(){
    ctx.clearRect(0,0,display.width,display.height);
    ctx.drawImage(image,0,0, newWidth , newHeight);
    
    for(var i = 0;i<storeProps.length;i++){
      ctx.save();
      ctx.translate(storeProps[i].x,storeProps[i].y);
      ctx.rotate(storeProps[i].angle);
      ctx.translate(-storeProps[i].x,-storeProps[i].y);
        
    ctx.drawImage(storeProps[i].src,storeProps[i].x,storeProps[i].y,storeProps[i].w,storeProps[i].h);
      ctx.restore();
    }
}
function incrW(src){
    var x =parseInt( document.getElementById("scalingW").value);
    src.w=x;
    redraw();
}
function incrH(src){
    var x =parseInt( document.getElementById("scalingH").value);
    src.h=x;
    redraw();
}
function rotateProps(src){
    var x =parseInt( document.getElementById("rotation").value);
    src.angle = -x*Math.PI/180;
    redraw();
}
function deleteProps(src){
    src.x = -500;
    for(var i = 0; i < storeProps.length;i++){
        if(storeProps[i]==src)storeProps.splice(i,1);
    }
    redraw();
}
function saveImage(link, canvasId, filename){
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}
showProps();
drawProps();
displayPic();
$("#photoHolder").mousedown(function(e){
    propsOnClick(e);
});
$("#photoHolder").mousemove(function(e){
    propsOnDrag(e);
});
$("#photoHolder").mouseup(function(e){
    MouseUp(e);
});
$("#photoHolder").mouseout(function(e){
    MouseUp(e);
});
document.getElementById('save').addEventListener('click', function() {
    var filename = 'image'+Math.round(Math.random()*100)+'.jpg';
    saveImage(this, 'photoHolder', filename);
    alert('save??');
});
