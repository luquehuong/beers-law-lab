// Copyright 2002-2013, University of Colorado Boulder

/**
 * Button that removes solute from the solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var removeSoluteString = require( 'string!BEERS_LAW_LAB/removeSolute' );

  /**
   * @param {ConcentrationSolution} solution
   * @param {ShakerParticles} shakerParticles
   * @param {Tandem} tandem - support for exporting instances from the sim
   * @param {Object} [options]
   * @constructor
   */
  function RemoveSoluteButton( solution, shakerParticles, tandem, options ) {

    options = _.extend( {
      baseColor: 'rgb(255,200,0)',
      font: new PhetFont( 22 ),
      textFill: 'black',
      xMargin: 10,
      tandem: tandem
    }, options );

    var thisButton = this;

    TextPushButton.call( thisButton, removeSoluteString, options );

    this.addListener( function() {
      solution.soluteAmountProperty.set( 0 );
      shakerParticles.removeAllParticles();
    } );

    // change the text fill to indicate whether the button is enabled
    solution.soluteAmountProperty.link( function( soluteAmount ) {
      thisButton.enabled = ( soluteAmount > 0 );
    } );
  }

  return inherit( TextPushButton, RemoveSoluteButton );
} );
