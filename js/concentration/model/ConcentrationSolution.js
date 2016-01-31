// Copyright 2013-2015, University of Colorado Boulder

/**
 * Solution model for the 'Concentration' screen.
 * This screen has a single solution that is mutated by changing the solute, solute amount, and volume.
 * Concentration is derived via M=mol/L.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var beersLawLab = require( 'BEERS_LAW_LAB/beersLawLab' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Fluid = require( 'BEERS_LAW_LAB/common/model/Fluid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Solvent = require( 'BEERS_LAW_LAB/common/model/Solvent' );

  /**
   * @param {Property.<Solute>} soluteProperty
   * @param {number} soluteAmount moles
   * @param {number} volume L
   * @param {Tandem} tandem
   * @constructor
   */
  function ConcentrationSolution( soluteProperty, soluteAmount, volume, tandem ) {

    var thisSolution = this;

    thisSolution.solvent = Solvent.WATER; // @public (read-only)

    // @public
    thisSolution.soluteProperty = soluteProperty;
    thisSolution.soluteAmountProperty = new Property( soluteAmount, { tandem: tandem.createTandem( 'soluteAmountProperty' ) } );
    thisSolution.volumeProperty = new Property( volume, { tandem: tandem.createTandem( 'volumeProperty' ) } );

    // @public for deferring update of precipitateAmount until we've changed both volume and soluteAmount, see concentration#1
    thisSolution.updatePrecipitateAmount = true;

    // @public derive amount of precipitate (moles)
    thisSolution.precipitateAmountProperty = new DerivedProperty(
      [ thisSolution.soluteProperty, thisSolution.soluteAmountProperty, thisSolution.volumeProperty ],
      function( solute, soluteAmount, volume ) {
        if ( thisSolution.updatePrecipitateAmount ) {
          return Math.max( 0, soluteAmount - ( volume * thisSolution.getSaturatedConcentration() ) );
        }
        else {
          return thisSolution.precipitateAmountProperty.get();
        }
      }, {
        tandem: tandem.createTandem( 'precipitateAmountProperty' )
      }
    );

    // @public derive concentration (M = mol/L)
    thisSolution.concentrationProperty = new DerivedProperty(
      [ thisSolution.soluteProperty, thisSolution.soluteAmountProperty, thisSolution.volumeProperty ],
      function( solute, soluteAmount, volume ) {
        return ( volume > 0 ) ? Math.min( thisSolution.getSaturatedConcentration(), soluteAmount / volume ) : 0;
      }, {
        tandem: tandem.createTandem( 'concentrationProperty' )
      }
    );

    // @public boolean property indicating whether the solution is saturated or not.
    this.saturatedProperty = new DerivedProperty( [ this.soluteProperty, this.soluteAmountProperty, this.volumeProperty ],
      function( solute, soluteAmount, volume ) {
        return ( volume > 0 ) && ( soluteAmount / volume ) > solute.getSaturatedConcentration();
      }, {
        tandem: tandem.createTandem( 'saturatedProperty' )
      }
    );

    Fluid.call( thisSolution, ConcentrationSolution.createColor( thisSolution.solvent, thisSolution.soluteProperty.get(), thisSolution.concentrationProperty.get() ) );

    // derive the solution color
    var updateColor = function() {
      thisSolution.colorProperty.set( ConcentrationSolution.createColor( thisSolution.solvent, thisSolution.soluteProperty.get(), thisSolution.concentrationProperty.get() ) );
    };
    thisSolution.soluteProperty.lazyLink( updateColor );
    thisSolution.concentrationProperty.lazyLink( updateColor );
  }

  beersLawLab.register( 'ConcentrationSolution', ConcentrationSolution );

  return inherit( Fluid, ConcentrationSolution, {

    // @public
    reset: function() {
      Fluid.prototype.reset.call( this );
      this.soluteAmountProperty.reset();
      this.volumeProperty.reset();
    },

    // @public convenience function
    getSaturatedConcentration: function() {
      return this.soluteProperty.get().getSaturatedConcentration();
    },

    // @public
    getNumberOfPrecipitateParticles: function() {
      var numberOfParticles = Math.round( this.soluteProperty.get().particlesPerMole * this.precipitateAmountProperty.get() );
      if ( numberOfParticles === 0 && this.precipitateAmountProperty.get() > 0 ) {
        numberOfParticles = 1;
      }
      return numberOfParticles;
    },

    /**
     * Converts the current concentration (mol/L) to percent concentration. See beers-law-lab#148,#149
     * @returns {number}
     * @public
    */
    getPercentConcentration: function() {
      var percentConcentration = 0;
      if ( this.volumeProperty.get() > 0 ) {
        var gramsOfSolute = this.soluteProperty.value.molarMass * ( this.soluteAmountProperty.get() - this.precipitateAmountProperty.get() );
        var gramsOfSolvent = this.volumeProperty.get() * this.solvent.gramsPerLiter;
        percentConcentration = 100 * ( gramsOfSolute / ( gramsOfSolute + gramsOfSolvent ) );
      }
      return percentConcentration;
    }
  }, {

    /*
     * Creates a color that corresponds to the solution's concentration.
     * @param {Solvent) solvent
     * @param {Solute} solute
     * @param {number} concentration
     * @static
     */
    createColor: function( solvent, solute, concentration ) {
      var color = solvent.colorProperty.get();
      if ( concentration > 0 ) {
        color = solute.colorScheme.concentrationToColor( concentration );
      }
      return color;
    }
  } );
} );
