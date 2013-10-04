// Copyright 2002-2013, University of Colorado Boulder

/**
 * Button that removes solute from the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TextButton = require( 'SUN/TextButton' );

  // strings
  var removeSoluteString = require( 'string!BEERS_LAW_LAB/removeSolute' );

  /**
   * @param {ConcentrationSolution} solution
   * @constructor
   */
  function RemoveSoluteButton( solution ) {

    var thisButton = this;

    TextButton.call( thisButton, removeSoluteString, function() {
      solution.soluteAmount.set( 0 );
    }, {
      font: new PhetFont( 22 ),
      textFill: 'black',
      textFillDisabled: 'rgb(175,175,175)',
      rectangleXMargin: 10,
      rectangleFillDisabled: 'white'
    } );

    // change the text fill to indicate whether the button is enabled
    solution.soluteAmount.link( function( soluteAmount ) {
      thisButton.enabled = ( soluteAmount > 0 );
    } );
  }

  inherit( TextButton, RemoveSoluteButton );

  return RemoveSoluteButton;
} );
