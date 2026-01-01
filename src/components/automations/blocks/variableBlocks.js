/**
 * Variable Blocks
 *
 * Variable operations: get, set, change
 */

import * as Blockly from 'blockly';

const VARIABLE_COLOUR = 330;

export function registerVariableBlocks() {
  // Set variable
  Blockly.Blocks['variables_set'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('set')
        .appendField(new Blockly.FieldTextInput('x'), 'VAR')
        .appendField('to');
      this.appendValueInput('VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(VARIABLE_COLOUR);
      this.setTooltip('Set a variable to a value');
      this.setHelpUrl('');
    },
  };

  // Get variable
  Blockly.Blocks['variables_get'] = {
    init: function () {
      this.appendDummyInput().appendField(new Blockly.FieldTextInput('x'), 'VAR');
      this.setOutput(true, null);
      this.setColour(VARIABLE_COLOUR);
      this.setTooltip('Get a variable value');
      this.setHelpUrl('');
    },
  };

  // Change variable by
  Blockly.Blocks['variables_change'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('change')
        .appendField(new Blockly.FieldTextInput('x'), 'VAR')
        .appendField('by');
      this.appendValueInput('DELTA').setCheck('Number');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(VARIABLE_COLOUR);
      this.setTooltip('Add a value to a variable');
      this.setHelpUrl('');
    },
  };

  // Increment variable
  Blockly.Blocks['variables_increment'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('increment')
        .appendField(new Blockly.FieldTextInput('x'), 'VAR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(VARIABLE_COLOUR);
      this.setTooltip('Add 1 to a variable');
      this.setHelpUrl('');
    },
  };

  // Decrement variable
  Blockly.Blocks['variables_decrement'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('decrement')
        .appendField(new Blockly.FieldTextInput('x'), 'VAR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(VARIABLE_COLOUR);
      this.setTooltip('Subtract 1 from a variable');
      this.setHelpUrl('');
    },
  };
}
