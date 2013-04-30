// Copyright 2002-2013, University of Colorado

/**
 * The "Concentration" tab. Conforms to the contact specified in joist/Tab
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function ( require ) {
  "use strict";

  // imports
  var BLLStrings = require( "common/BLLStrings" );
  var ConcentrationModel = require( "concentration/model/ConcentrationModel" );
  var ConcentrationView = require( "concentration/view/ConcentrationView" );
  var Image = require( "SCENERY/nodes/Image" );
  var ModelViewTransform2 = require( "PHETCOMMON/view/ModelViewTransform2" );
  var Vector2 = require( "DOT/Vector2" );

  // images
  var ICON = require( "image!images/Concentration-icon.jpg" );

  function ConcentrationTab() {

    this.name = BLLStrings.concentration;
    this.icon = new Image( ICON );
    this.backgroundColor = "white";

    var mvt = ModelViewTransform2.createIdentity();

    this.createModel = function () {
      return new ConcentrationModel();
    };

    this.createView = function ( model ) {
      return new ConcentrationView( model, mvt );
    };
  }

  return ConcentrationTab;
} );