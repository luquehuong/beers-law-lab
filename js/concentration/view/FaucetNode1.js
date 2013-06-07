// Copyright 2002-2013, University of Colorado

/**
 * Faucet with a rotating lever.
 * Pushing the lever down increases the flow rate.
 * Releasing the lever sets the flow rate to zero.
 * When the faucet is disabled, the flow rate is set to zero and the lever is disabled.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var assert = require( "ASSERT/assert" )( "beers-law-lab" );
  var BLLImages = require( "common/BLLImages" );
  var Circle = require( "SCENERY/nodes/Circle" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var LinearFunction = require( "common/util/LinearFunction" );
  var Matrix3 = require( "DOT/Matrix3" );
  var Node = require( "SCENERY/nodes/Node" );
  var Range = require( "DOT/Range" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );
  var Transform3 = require( "DOT/Transform3" );
  var Util = require( "DOT/Util" );
  var Vector2 = require( "DOT/Vector2" );

  // constants
  var DEBUG_ORIGIN = false;
  var SPOUT_OUTPUT_CENTER_X = 83; // center of spout, determined by inspecting image file
  var HANDLE_ORIENTATION_RANGE = new Range( -Math.PI / 4, 0 ); // full off -> full on

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function FaucetNode1( faucet, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    var orientationToFlowRate = new LinearFunction( HANDLE_ORIENTATION_RANGE.min, 0, HANDLE_ORIENTATION_RANGE.max, faucet.maxFlowRate );

    // child nodes
    var leverNode = new Image( BLLImages.getImage( "faucet1_lever.png" ), {
      cursor: "pointer"
    } );
    var pipeNode = new Image( BLLImages.getImage( "faucet1_pipe.png" ) );
    var pivotNode = new Image( BLLImages.getImage( "faucet1_pivot.png" ) );
    var spoutNode = new Image( BLLImages.getImage( "faucet1_spout.png" ) );

    // rendering order
    thisNode.addChild( pipeNode );
    thisNode.addChild( leverNode );
    thisNode.addChild( pivotNode );
    thisNode.addChild( spoutNode );

    // origin
    if ( DEBUG_ORIGIN ) {
      thisNode.addChild( new Circle( { radius: 3, fill: 'red' } ) );
    }

    //TODO This is horizontally stretching the image, would look better to tile a rectangle with a texture.
    // size the pipe
    var pipeWidth = mvt.modelToViewDeltaX( faucet.location.x - faucet.pipeMinX ) - SPOUT_OUTPUT_CENTER_X;
    assert && assert( pipeWidth > 0 );
    pipeNode.setScaleMagnitude( pipeWidth / pipeNode.width, 1 );

    // layout
    {
      // move spout's origin to the center of it's output
      spoutNode.x = -SPOUT_OUTPUT_CENTER_X;
      spoutNode.y = -spoutNode.height;
      // pipe connects to left edge of spout
      pipeNode.x = spoutNode.left - pipeNode.width;
      pipeNode.y = spoutNode.top;
      // pivot is on top of spout
      pivotNode.x = spoutNode.left + ( 0.25 * spoutNode.width );
      pivotNode.y = spoutNode.top - pivotNode.height;
      // butt end of lever is centered in pivot
      leverNode.x = pivotNode.centerX;
      leverNode.y = pivotNode.centerY - ( leverNode.height / 2 );
    }

    // move to model location
    var location = mvt.modelToViewPosition( faucet.location );
    thisNode.x = location.x;
    thisNode.y = location.y;

    // determine on/off lever locations
    leverNode.rotateAround( new Vector2( pivotNode.centerX, pivotNode.centerY ), HANDLE_ORIENTATION_RANGE.max );
    var leverOnY = leverNode.bottom;
    leverNode.setRotation( 0 );
    leverNode.rotateAround( new Vector2( pivotNode.centerX, pivotNode.centerY ), HANDLE_ORIENTATION_RANGE.min );
    var leverOffY = leverNode.top;
    // leave the lever in the off orientation

    // mapping from lever y-coordinate to orientation
    var yToOrientation = new LinearFunction( leverOffY, HANDLE_ORIENTATION_RANGE.min, leverOnY, HANDLE_ORIENTATION_RANGE.max );

    leverNode.addInputListener( new SimpleDragHandler(
        {
          //TODO: revisit this to make it feel more smooth/natural
          // adjust the flow
          drag: function( event ) {
            if ( faucet.enabled.get() ) {
              var localPosition = leverNode.globalToParentPoint( event.pointer.point );
              var y = Util.clamp( localPosition.y, leverOffY, leverOnY );
              var leverOrientation = yToOrientation( y );
              var flowRate = orientationToFlowRate( leverOrientation );
              faucet.flowRate.set( flowRate );
            }
          },

          // turn off the faucet when the lever is released
          end: function() {
            faucet.flowRate.set( 0 );
          },

          // prevent default behavior that translates the node
          translate: function() {
          }
        } ) );

    faucet.flowRate.link( function( flowRate ) {
      // reset the lever's transform
      leverNode.resetTransform();
      // butt end of lever is centered in pivot
      leverNode.x = pivotNode.centerX;
      leverNode.y = pivotNode.centerY - ( leverNode.height / 2 );
      // lever orientation matches flow rate
      var orientation = orientationToFlowRate.inverse( flowRate );
      leverNode.rotateAround( new Vector2( pivotNode.centerX, pivotNode.centerY ), orientation );
    } );
  }

  inherit( Node, FaucetNode1 );

  return FaucetNode1;
} );
