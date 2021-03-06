// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var phetio = require( 'ifphetio!PHET_IO/phetio' );


  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TBeersLawSolution( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.beersLawLab.BeersLawSolution );
  }

  phetioInherit( TObject, 'TBeersLawSolution', TBeersLawSolution, {}, {
    documentation: 'The solution for the sim',

    // Because the simulation has a Property that contains BeersLawSolution, the Property relies on these methods for saving and loading the values.
    fromStateObject: function( stateObject ) {
      return phetio.getWrapper( stateObject ).instance;
    },

    toStateObject: function( instance ) {
      return instance.phetioID;
    }
  } );

   beersLawLab.register( 'TBeersLawSolution', TBeersLawSolution );

  return TBeersLawSolution;
} );

