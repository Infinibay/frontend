/**
 * Loop Blocks
 *
 * Iteration constructs: for each, repeat
 */

import * as Blockly from 'blockly';

const LOOP_COLOUR = 120;

export function registerLoopBlocks() {
  // For Each
  Blockly.Blocks['loops_foreach'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('for each')
        .appendField(new Blockly.FieldTextInput('item'), 'VAR');
      this.appendValueInput('LIST').setCheck('Array').appendField('in');
      this.appendStatementInput('DO').appendField('do');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(LOOP_COLOUR);
      this.setTooltip('Loop through each item in a list');
      this.setHelpUrl('');
    },
  };

  // Repeat N times
  Blockly.Blocks['loops_repeat'] = {
    init: function () {
      this.appendValueInput('TIMES').setCheck('Number').appendField('repeat');
      this.appendDummyInput().appendField('times');
      this.appendStatementInput('DO').appendField('do');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(LOOP_COLOUR);
      this.setTooltip('Repeat actions a specific number of times');
      this.setHelpUrl('');
    },
  };

  // While
  Blockly.Blocks['loops_while'] = {
    init: function () {
      this.appendValueInput('CONDITION').setCheck('Boolean').appendField('while');
      this.appendStatementInput('DO').appendField('do');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(LOOP_COLOUR);
      this.setTooltip('Repeat while condition is true');
      this.setHelpUrl('');
    },
  };

  // Break
  Blockly.Blocks['loops_break'] = {
    init: function () {
      this.appendDummyInput().appendField('break out of loop');
      this.setPreviousStatement(true, null);
      this.setColour(LOOP_COLOUR);
      this.setTooltip('Exit the current loop');
      this.setHelpUrl('');
    },
  };

  // Continue
  Blockly.Blocks['loops_continue'] = {
    init: function () {
      this.appendDummyInput().appendField('continue to next iteration');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(LOOP_COLOUR);
      this.setTooltip('Skip to the next loop iteration');
      this.setHelpUrl('');
    },
  };

  // Array length
  Blockly.Blocks['loops_array_length'] = {
    init: function () {
      this.appendValueInput('LIST').setCheck('Array').appendField('length of list');
      this.setOutput(true, 'Number');
      this.setColour(LOOP_COLOUR);
      this.setTooltip('Number of items in a list');
      this.setHelpUrl('');
    },
  };

  // Array get item
  Blockly.Blocks['loops_array_get'] = {
    init: function () {
      this.appendValueInput('LIST').setCheck('Array').appendField('item');
      this.appendValueInput('INDEX').setCheck('Number').appendField('at index');
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(LOOP_COLOUR);
      this.setTooltip('Get item at index from list (0-based)');
      this.setHelpUrl('');
    },
  };
}
