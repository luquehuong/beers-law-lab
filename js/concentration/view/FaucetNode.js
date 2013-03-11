// Copyright 2002-2013, University of Colorado

/**
 * Faucet, with a movable handle to control the flow rate.
 * Releasing the handle sets the flow rate to zero.
 * When the faucet is disabled, the flow rate is set to zero and the handle is disabled.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define(
  [
    "SCENERY/nodes/Node",
    "SCENERY/nodes/Image",
    "SCENERY/input/SimpleDragHandler",
    "DOT/Matrix3",
    "DOT/Transform3",
    "DOT/Vector2",
    "PHETCOMMON/math/MathUtil",
    "PHETCOMMON/math/Range",
    "PHETCOMMON/util/Inheritance",
    "common/view/DebugOriginNode",
    "common/util/LinearFunction",
    "image!images/faucet_handle.png",
    "image!images/faucet_pipe.png",
    "image!images/faucet_pivot.png",
    "image!images/faucet_spout.png"
  ],
  function ( Node, Image, SimpleDragHandler, Matrix3, Transform3, Vector2, MathUtil, Range, Inheritance, DebugOriginNode, LinearFunction, handleImage, pipeImage, pivotImage, spoutImage ) {
    "use strict";

    var DEBUG_ORIGIN = true;

    // where the fluid should come out of the unscaled spout image.
    var SPOUT_OUTPUT_CENTER_X = 85;
    var SPOUT_OUTPUT_WIDTH = 42;

    var HANDLE_ORIENTATION_RANGE = new Range( -Math.PI / 4, 0 ); // full off -> full on

    function FaucetNode( faucet, mvt ) {

      Node.call( this ); // constructor stealing

      console.log( "length=" + HANDLE_ORIENTATION_RANGE.getLength() );//XXX
      var orientationToFlowRate = new LinearFunction( HANDLE_ORIENTATION_RANGE, new Range( 0, faucet.maxFlowRate ) );

      // child nodes
      var handleNode = new Image( handleImage, {
        cursor: "pointer"
      } );
      var pipeNode = new Image( pipeImage );
      var pivotNode = new Image( pivotImage );
      var spoutNode = new Image( spoutImage );

      // rendering order
      this.addChild( pipeNode );
      this.addChild( handleNode );
      this.addChild( pivotNode );
      this.addChild( spoutNode );

      // origin
      if ( DEBUG_ORIGIN ) {
        this.addChild( new DebugOriginNode( "red" ) );
      }

      //TODO This is horizontally stretching the image, would look better to tile a rectangle with a texture.
      // size the pipe
      pipeNode.setScale( mvt.modelToView( faucet.pipeLength ) / pipeNode.width, 1 );

      // layout
      {
        // move spout's origin to the center of it's output
        spoutNode.x = -SPOUT_OUTPUT_CENTER_X;
        spoutNode.y = -spoutNode.height;
        // pipe connects to left edge of spout
        pipeNode.x = spoutNode.getLeft() - pipeNode.width;
        pipeNode.y = spoutNode.getTop();
        // pivot is on top of spout
        pivotNode.x = spoutNode.getLeft() + ( 0.25 * spoutNode.width );
        pivotNode.y = spoutNode.getTop() - pivotNode.height;
        // butt end of handle is centered in pivot
        handleNode.x = pivotNode.getCenterX();
        handleNode.y = pivotNode.getCenterY() - ( handleNode.height / 2 );

      }

      // move to model location
      var location = mvt.modelToView( faucet.location );
      this.x = location.x;
      this.y = location.y;

      // determine on/off handle locations
      handleNode.rotateAround( new Vector2( pivotNode.getCenterX(), pivotNode.getCenterY() ), HANDLE_ORIENTATION_RANGE.max );
      var handleOnY = handleNode.getBounds().maxY;
      handleNode.setRotation( 0 );
      handleNode.rotateAround( new Vector2( pivotNode.getCenterX(), pivotNode.getCenterY() ), HANDLE_ORIENTATION_RANGE.min );
      var handleOffY = handleNode.getBounds().minY;
      // leave the handle in the off orientation

      // mapping from handle y-coordinate to orientation
      console.log( "handleOffY=" + handleOffY + " handleOnY=" + handleOnY );//XXX
      var yToOrientation = new LinearFunction( new Range( handleOffY, handleOnY ), HANDLE_ORIENTATION_RANGE );

      handleNode.addInputListener( new SimpleDragHandler(
        {
          drag: function ( event, trail ) {
            var localPosition = trail.getTransform().transformPosition2( event.finger.point ); //XXX exception in Matrix3.timesVector2
            console.log( "event.finger.point=" +event.finger.point.toString() + "localPosition=" + localPosition );//XXX
            var y = MathUtil.clamp( localPosition.y, handleOffY, handleOnY );
            var handleOrientation = yToOrientation.evaluate( y );
            var flowRate = orientationToFlowRate.evaluate( handleOrientation );
            faucet.flowRateProperty.set( flowRate );
          },
          translate: function () {
          }
        } ) );

      //XXX toggle on/off until I can figure out dag handler.
//      handleNode.addInputListener(
//        {
//          down:function( event ) {
//            if ( faucet.flowRateProperty.get() == faucet.maxFlowRate ) {
//              faucet.flowRateProperty.set( 0 );
//            }
//            else {
//              faucet.flowRateProperty.set( faucet.maxFlowRate );
//            }
//          }
//        } );

      faucet.flowRateProperty.addObserver( function ( flowRate ) {
        // reset the handle's transform //TODO how to reset transform to identity in scenery?
        handleNode.resetTransform();
        // butt end of handle is centered in pivot
        handleNode.x = pivotNode.getCenterX();
        handleNode.y = pivotNode.getCenterY() - ( handleNode.height / 2 );
        // handle orientation matches flow rate
        var orientation = orientationToFlowRate.evaluateInverse( flowRate );
        console.log( "flowRate=" + flowRate + " orientation=" + MathUtil.toDegrees( orientation ) );//XXX
        handleNode.rotateAround( new Vector2( pivotNode.getCenterX(), pivotNode.getCenterY() ), orientation );
      } );
    }

    Inheritance.inheritPrototype( FaucetNode, Node ); // prototype chaining

    return FaucetNode;
  }
);
