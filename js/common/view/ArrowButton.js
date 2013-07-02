// Copyright 2002-2013, University of Colorado Boulder

//TODO Handle press-and-hold feature in Sim.animationLoop instead of using timers.
//TODO This implementation should eventually use sun.Button
/**
 * Button with an arrow that points left or right.
 * Pressing and releasing the button fires the callback once.
 * Pressing and holding the button continuously fires the callback.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function( require ) {
  'use strict';

  // imports
  var Button = require( 'SUN/Button' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {ArrowButton.Direction} direction
   * @param callback
   * @param options
   * @constructor
   */
  function ArrowButton( direction, callback, options ) {

    var thisButton = this;

    var DEFAULT_ARROW_WIDTH = 20;
    options = _.extend( {
        arrowHeight: DEFAULT_ARROW_WIDTH,
        arrowWidth: DEFAULT_ARROW_WIDTH * Math.sqrt( 3 ) / 2,
        fill: 'white',
        stroke: 'black',
        lineWidth: 1,
        xMargin: 7,
        yMargin: 5,
        cornerRadius: 4,
        enabledFill: 'black',
        disabledFill: 'rgb(175,175,175)',
        enabledStroke: 'black',
        disabledStroke: 'rgb(175,175,175)'
      },
      options );

    Node.call( thisButton );

    // nodes
    var arrowShape = ( direction === ArrowButton.Direction.LEFT ) ?
                     new Shape().moveTo( 0, 0 ).lineTo( options.arrowWidth, options.arrowHeight / 2 ).lineTo( 0, options.arrowHeight ).close() :
                     new Shape().moveTo( 0, options.arrowHeight / 2 ).lineTo( options.arrowWidth, 0 ).lineTo( options.arrowWidth, options.arrowHeight ).close();
    var arrowNode = new Path( { fill: options.enabledFill, shape: arrowShape } );
    var background = new Rectangle( 0, 0, arrowNode.width + ( 2 * options.xMargin ), arrowNode.height + ( 2 * options.yMargin ), options.cornerRadius, options.cornerRadius,
      {stroke: options.stroke, lineWidth: options.lineWidth, fill: options.fill } );

    // rendering order
    thisButton.addChild( background );
    thisButton.addChild( arrowNode );

    // layout
    arrowNode.centerX = background.centerX;
    arrowNode.centerY = background.centerY;

    // touch area
    var dx = 0.25 * thisButton.width;
    var dy = 0.25 * thisButton.height;
    thisButton.touchArea = Shape.rectangle( -dx, -dy, thisButton.width + dx + dx, thisButton.height + dy + dy );

    // interactivity
    thisButton.cursor = "pointer";
    var enabled = true;
    var fired = false;
    var timeoutID = null;
    var intervalID = null;
    var cleanupTimer = function() {
      if ( timeoutID ) {
        window.clearTimeout( timeoutID );
        timeoutID = null;
      }
      if ( intervalID ) {
        window.clearInterval( intervalID );
        intervalID = null;
      }
    };
    thisButton.addInputListener( new ButtonListener( {

      over: function() {
        //TODO highlight
      },

      down: function() {
        fired = false;
        timeoutID = window.setTimeout( function() {
          timeoutID = null;
          fired = true;
          intervalID = window.setInterval( function() {
            if ( enabled ) {
              callback();
            }
          }, 100 );
        }, 500 );
      },

      up: function() {
        cleanupTimer();
      },

      fire: function() {
        cleanupTimer();
        if ( !fired && enabled ) {
          callback();
        }
      }
    } ) );

    thisButton.setEnabled = function( value ) {
      enabled = value;
      if ( !enabled ) {
        cleanupTimer();
      }
      arrowNode.fill = enabled ? options.enabledFill : options.disabledFill;
      background.stroke = enabled ? options.enabledStroke : options.disabledStroke;
      thisButton.pickable = enabled; //TODO workaround for lack of Button.enabled
    };
    thisButton.setEnabled( true );
  }

  inherit( Node, ArrowButton );

  // direction that the arrow points
  ArrowButton.Direction = {
    'LEFT': 0,
    'RIGHT': 1
  };

  return ArrowButton;
} );