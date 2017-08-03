  'use strict';
  angular
    .module('com.module.drawing')
    .controller('CreateCtrl', function($scope, $uibModal, $stateParams,DrawingService) {

      console.log($stateParams.hash);

      this.$onInit = function() {
        //defaults
        $scope.newData = false;

        //TODO load drawing
        $scope.draw = {
          isPrivate:false,
          drawTime:0
        };

        $scope.tools = {
          type:"brush",
          color:"#ff0000",
          width:3
        };

        $scope.slider = {
            options: {
              floor: 1,
              ceil: 10,
              step: 1,
              minLimit: 1,
              maxLimit: 10
            }
        };

        initCanvas();

        $scope.$on('$destroy',function() {
          deregisterCanvasEvents();
        });
      };


      //scope functions
      $scope.replayDrawing = function() {
        if(recordArr.length==0)
          return;

        $scope.isPlaying = true;
        clearCanvas();
        recordPlay(0,0);
      };

      $scope.save = function () {
        $scope.newData = false;
        $scope.draw.drawData = recordArr;
        DrawingService.save($scope.draw).then(function(savedObj) {
          $uibModal.open({
            animation: true,
            backdrop: false,
            templateUrl: 'modules/drawing/views/saved.modal.html',
            controller: 'SavedModalCtrl',
            resolve: {
              shareLink: function() {
                var hash = "#!/app/drawing/create/"+savedObj.hashKey;
                return window.location.href.replace(window.location.hash,hash);
              }
            }
          });
        }).catch(function(err) {
          $scope.newData = true;
          console.log(err);
        });

      };



      //*************CANVAS Recorder
      var recordStartTS;
      var recordArr = [];

      function recordStart() {
        if(!recordStartTS) {
          recordStartTS = Date.now();
          $scope.newData = true;
          $scope.$apply();
        }
      }

      function recordDraw(x,y,size,color) {
        var ts = Date.now()-recordStartTS;
        var step  = {
          ts:ts,
          x:x,
          y:y,
          s:size,
          r:color.r,
          g:color.g,
          b:color.b
        };
        recordArr.push(step);
      }

      function recordPlay(idx,lastTs) {
        if(idx>=recordArr.length) {
          $scope.isPlaying = false;
          $scope.$apply();
          return;
        }

        var step = recordArr[idx];
        var ts = Math.min(step.ts-lastTs,2000); //max wait time just for presentation
        setTimeout(function () {
          prepareAndDraw(step);
          recordPlay(++idx,step.ts);
        }, ts);
      }


      //*************CANVAS

      // Variables for referencing the canvas and 2dcanvas context
      var canvas,ctx;

      // Variables to keep track of the mouse position and left-button status
      var mouseX,mouseY,mouseDown=0;
      const PRECISION = 2000; //normalize to 2000x2000 images

      // Variables to keep drawing style & color
      var drawSize, drawColor, colorComponents;

      // Draws a dot at a specific position on the supplied canvas name
      // Parameters are: A canvas context, the x position, the y position,
      function drawDot(x,y,skipRecord) {
        // Select a fill style
        ctx.fillStyle = drawColor;

        // Draw a filled circle
        ctx.beginPath();
        ctx.arc(x, y, drawSize, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();

        //record the drawing
        if(!skipRecord)
          recordDraw(Math.floor(x/canvas.width*PRECISION), Math.floor(y/canvas.width*PRECISION), $scope.tools.width, colorComponents);
      }

      function prepareAndDraw(step) {
        drawSize = Math.ceil((step.s)/100*canvas.width);
        drawColor = 'rgb('+step.r+','+step.g+','+step.b+')';
        drawDot(Math.floor(step.x/PRECISION*canvas.width),Math.floor(step.y/PRECISION*canvas.height),true);
      }

      function reDraw() {
        clearCanvas();
        for(let i=0;i<recordArr.length;i++) {
          prepareAndDraw(recordArr[i]);
        }
      }
      // Clear the canvas context using the canvas width and height
      function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Keep track of the mouse button being pressed and draw a dot at current location
      function sketchpad_mouseDown(e) {
        //set the record start timer
        recordStart();
        //update mouse position
        getMousePos(e);
        //setup style & color
        drawSetup();
        //draw
        drawDot(mouseX,mouseY);
        mouseDown=1;
      }

      function drawSetup() {
        drawSize = Math.ceil(($scope.tools.width)/100*canvas.width);

        switch ($scope.tools.type) {
          case "brush":
            drawColor = $scope.tools.color;

            var c = drawColor.replace("#","0x");
            colorComponents = {
                r: (c & 0xff0000) >> 16,
                g: (c & 0x00ff00) >> 8,
                b: (c & 0x0000ff)
            };
            break;
          case "erase":
            drawColor = "#ffffff";
            colorComponents = {
                r: 255,
                g: 255,
                b: 255
            };
            break;
          default:
            console.log("unknown tool type");
        }
      }

      // Keep track of the mouse button being released
      function sketchpad_mouseUp() {
        if(mouseDown==1) {
          $scope.draw.drawTime = Math.round(recordArr[recordArr.length-1].ts/1000);
          $scope.$apply();
        }
        mouseDown=0;
      }

      // Keep track of the mouse position and draw a dot if mouse button is currently pressed
      function sketchpad_mouseMove(e) {
        // Update the mouse co-ordinates when moved
        getMousePos(e);
        // Draw a dot if the mouse button is currently being pressed
        if (mouseDown==1) {

          drawDot(mouseX,mouseY);
          //prevent mobile scrollers from moveing
          e.preventDefault();
        }
      }

      // Get the current mouse position relative to the top-left of the canvas
      function getMousePos(e) {
        if (!e)
            var e = event;

        if (e.offsetX) {
            mouseX = e.offsetX;
            mouseY = e.offsetY;
        }
        else if (e.layerX) {
            mouseX = e.layerX;
            mouseY = e.layerY;
        }
      }

      //re-setup the canvas on resize
      function sketchpad_resize() {
        //set canvas sizes - fixes scale bug with mouse events
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        //redraw the painting on new canvas sizes
        reDraw();
      }

      // Set-up the canvas and add our event handlers after the page has loaded
      function initCanvas() {
        // Get the specific canvas element from the HTML document
        canvas = document.querySelector('#cnvsDraw');

        // If the browser supports the canvas tag, get the 2d drawing context for this canvas
        if (canvas.getContext)
            ctx = canvas.getContext('2d');

        // Check that we have a valid context to draw on/with before adding event handlers
        if (ctx) {
          if(is_touch_device()) {
            addEvent(canvas, "touchstart", sketchpad_mouseDown);
            addEvent(canvas, "touchmove", sketchpad_mouseMove);
            addEvent(window, "touchend", sketchpad_mouseUp);
          } else {
            addEvent(canvas, "mousedown", sketchpad_mouseDown);
            addEvent(canvas, "mousemove", sketchpad_mouseMove);
            addEvent(window, "mouseup", sketchpad_mouseUp);
          }

          addEvent(window, "resize", sketchpad_resize);

          //set canvas sizes - fixes scale bug with mouse events
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
        }
      }

      //unregister events registered on page form initCanvas()
      function deregisterCanvasEvents() {
        if(is_touch_device()) {
          removeEvent(window, 'touchend', sketchpad_mouseUp);
        } else {
          removeEvent(window, 'mouseup', sketchpad_mouseUp);
        }
        removeEvent(window, "resize", sketchpad_resize);
      }


      //************* helper functions
      function is_touch_device() {
        return 'ontouchstart' in window        // works on most browsers
            || navigator.maxTouchPoints;       // works on IE10/11 and Surface
      }

      function addEvent(object, type, callback) {
          if (object == null || typeof(object) == 'undefined') return;
          if (object.addEventListener) {
              object.addEventListener(type, callback, false);
          } else if (object.attachEvent) {
              object.attachEvent("on" + type, callback);
          } else {
              object["on"+type] = callback;
          }
      }

      function removeEvent(object, type, callback) {
          if (object == null || typeof(object) == 'undefined') return;
          if (object.removeEventListener) {
              object.removeEventListener(type, callback);
          } else if (object.detachEvent) {
              object.detachEvent("on" + type, callback);
          } else {
              object["on"+type] = callback;
          }
      }

    });
