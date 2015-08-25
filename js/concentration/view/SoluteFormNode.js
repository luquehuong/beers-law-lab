// Copyright 2002-2013, University of Colorado Boulder

/**
 * Radio buttons that select the solution form, either 'solid' (shaker) or 'liquid' (dropper).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var BLLConstants = require( 'BEERS_LAW_LAB/common/BLLConstants' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var solidString = require( 'string!BEERS_LAW_LAB/solid' );
  var solutionString = require( 'string!BEERS_LAW_LAB/solution' );

  // images
  var shakerIconImage = require( 'image!BEERS_LAW_LAB/shaker-icon.png' );
  var dropperIconImage = require( 'image!BEERS_LAW_LAB/dropper-icon.png' );

  /**
   * @param {string} text
   * @param {*} image any type supported by scenery.Image
   * @param {Object} textOptions
   * @constructor
   */
  function TextAndIconNode( text, image, textOptions ) {
    var textNode = new Text( text, textOptions );
    var imageNode = new Image( image, {
      left: textNode.right + 10,
      centerY: textNode.centerY
    } );
    return new Node( { children: [ textNode, imageNode ] } );
  }

  inherit( Node, TextAndIconNode );

  /**
   * @param {Property.<string>} soluteFormProperty form of the solute, 'solid' or 'liquid'
   * @param {Shaker} shaker
   * @param {Dropper} dropper
   * @param {Tandem} tandem - support for exporting instances from the sim
   * @constructor
   */
  function SoluteFormNode( soluteFormProperty, shaker, dropper, tandem ) {

    var TEXT_OPTIONS = { font: new PhetFont( 22 ), fill: 'black' };
    var SEPARATOR_SPACING = 30;

    var shakerButton = new AquaRadioButton( soluteFormProperty, 'solid',
      new TextAndIconNode( solidString, shakerIconImage, TEXT_OPTIONS ), {
        radius: BLLConstants.RADIO_BUTTON_RADIUS,
        tandem: tandem.createTandem( 'solidRadioButton' )
      } );

    // vertical separator
    var separator = new Line( 0, 0, 0, shakerButton.height, {
      stroke: 'rgb(150,150,150)',
      lineWidth: 0.5,
      left: shakerButton.right + SEPARATOR_SPACING,
      centerY: shakerButton.centerY
    } );

    var dropperButton = new AquaRadioButton( soluteFormProperty, 'liquid',
      new TextAndIconNode( solutionString, dropperIconImage, TEXT_OPTIONS ), {
        radius: BLLConstants.RADIO_BUTTON_RADIUS,
        left: separator.right + SEPARATOR_SPACING,
        tandem: tandem.createTandem( 'solutionRadioButton' )
      } );

    Node.call( this, { children: [ shakerButton, separator, dropperButton ] } );

    soluteFormProperty.link( function( soluteForm ) {
      shaker.visibleProperty.set( soluteForm === 'solid' );
      dropper.visibleProperty.set( soluteForm === 'liquid' );
    } );

    shaker.visibleProperty.link( function( visible ) {
      soluteFormProperty.set( visible ? 'solid' : 'liquid' );
    } );

    dropper.visibleProperty.link( function( visible ) {
      soluteFormProperty.set( visible ? 'liquid' : 'solid' );
    } );
  }

  return inherit( Node, SoluteFormNode );
} );