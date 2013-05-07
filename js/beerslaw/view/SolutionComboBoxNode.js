// Copyright 2002-2013, University of Colorado

/**
 * Combo box for selecting solutions.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function ( require ) {
  "use strict";

  // imports
  var assert = require( "ASSERT/assert" )( "beers-law-lab" );
  var BLLStrings = require( "common/BLLStrings" );
  var ComboBoxItem = require( "common/view/ComboBoxItem" );
  var ComboBoxNode = require( "common/view/ComboBoxNode" );
  var HTMLText = require( "SCENERY/nodes/HTMLText" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var StringUtils = require( "common/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * An item in the combo box.
   * @param solution
   * @constructor
   */
  function Item( solution ) {

    // node
    var node = new Node();
    var colorNode = new Rectangle( 0, 0, 20, 20, { fill: solution.saturatedColor.toCSS(), stroke: solution.saturatedColor.darker().toCSS() } );
    var textNode = new HTMLText( solution.getDisplayName(), { font: "20px Arial" } );
    node.addChild( colorNode );
    node.addChild( textNode );
    textNode.left = colorNode.right + 5;
    textNode.centerY = colorNode.centerY;

    ComboBoxItem.call( this, node, solution );
  }

  inherit( Item, ComboBoxItem );

  /**
   * @param {Array} solutions of type BeersLawSolution
   * @param {Property} selectedSolution of type BeersLawSolution
   * @constructor
   */
  function SolutionComboBoxNode( solutions, selectedSolution ) {

    // "Solution" label
    var labelNode = new Text( StringUtils.format( BLLStrings.pattern_0label, [BLLStrings.solution] ), { font: "20px Arial" } );

    // items
    var items = new Array();
    for ( var i = 0; i < solutions.length; i++ ) {
      var solution = solutions[i];
      items[i] = new Item( solution );
    }

    ComboBoxNode.call( this, items, selectedSolution, { labelNode: labelNode, listPosition: "above" } );
  }

  inherit( SolutionComboBoxNode, ComboBoxNode );

  return SolutionComboBoxNode;
} );