/**
 * Logic Blocks
 *
 * Boolean logic operations: AND, OR, NOT, true, false
 */

import * as Blockly from 'blockly';

const LOGIC_COLOUR = 210;

export function registerLogicBlocks() {
  // AND
  Blockly.Blocks['logic_and'] = {
    init: function () {
      this.appendValueInput('A').setCheck('Boolean');
      this.appendValueInput('B').setCheck('Boolean').appendField('and');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(LOGIC_COLOUR);
      this.setTooltip(
        'True only when BOTH conditions are met. ' +
        'Example: CPU > 90% AND Memory > 80% must both be true to trigger.'
      );
      this.setHelpUrl('');
    },
  };

  // OR
  Blockly.Blocks['logic_or'] = {
    init: function () {
      this.appendValueInput('A').setCheck('Boolean');
      this.appendValueInput('B').setCheck('Boolean').appendField('or');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(LOGIC_COLOUR);
      this.setTooltip(
        'True when EITHER condition is met. ' +
        'Example: CPU > 90% OR Memory > 80% - either one will trigger.'
      );
      this.setHelpUrl('');
    },
  };

  // NOT
  Blockly.Blocks['logic_not'] = {
    init: function () {
      this.appendValueInput('VALUE').setCheck('Boolean').appendField('not');
      this.setOutput(true, 'Boolean');
      this.setColour(LOGIC_COLOUR);
      this.setTooltip(
        'Flips true to false and false to true. ' +
        'Example: "not Defender enabled" triggers when Defender is OFF.'
      );
      this.setHelpUrl('');
    },
  };

  // TRUE
  Blockly.Blocks['logic_true'] = {
    init: function () {
      this.appendDummyInput().appendField('true');
      this.setOutput(true, 'Boolean');
      this.setColour(LOGIC_COLOUR);
      this.setTooltip('A constant "yes" value. Useful for testing or always-true conditions.');
      this.setHelpUrl('');
    },
  };

  // FALSE
  Blockly.Blocks['logic_false'] = {
    init: function () {
      this.appendDummyInput().appendField('false');
      this.setOutput(true, 'Boolean');
      this.setColour(LOGIC_COLOUR);
      this.setTooltip('A constant "no" value. Useful for testing or disabling a branch.');
      this.setHelpUrl('');
    },
  };

  // IF-THEN (control flow)
  Blockly.Blocks['logic_if'] = {
    init: function () {
      this.appendValueInput('CONDITION').setCheck('Boolean').appendField('if');
      this.appendStatementInput('DO').appendField('then');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(LOGIC_COLOUR);
      this.setTooltip(
        'Runs the "then" blocks only when the condition is true. ' +
        'The main building block for decision-making in your automation.'
      );
      this.setHelpUrl('');
    },
  };

  // IF-THEN-ELSE
  Blockly.Blocks['logic_if_else'] = {
    init: function () {
      this.appendValueInput('CONDITION').setCheck('Boolean').appendField('if');
      this.appendStatementInput('DO_TRUE').appendField('then');
      this.appendStatementInput('DO_FALSE').appendField('else');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(LOGIC_COLOUR);
      this.setTooltip(
        'Runs "then" if condition is true, otherwise runs "else". ' +
        'Use this when you need different actions for each case.'
      );
      this.setHelpUrl('');
    },
  };
}
