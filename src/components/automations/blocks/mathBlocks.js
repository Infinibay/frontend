/**
 * Math Blocks
 *
 * Mathematical operations: arithmetic, aggregations, rounding
 */

import * as Blockly from 'blockly';

const MATH_COLOUR = 180;

export function registerMathBlocks() {
  // Number literal
  Blockly.Blocks['math_number'] = {
    init: function () {
      this.appendDummyInput().appendField(new Blockly.FieldNumber(0), 'NUM');
      this.setOutput(true, 'Number');
      this.setColour(MATH_COLOUR);
      this.setTooltip('A number value');
      this.setHelpUrl('');
    },
  };

  // Arithmetic
  Blockly.Blocks['math_arithmetic'] = {
    init: function () {
      this.appendValueInput('A').setCheck('Number');
      this.appendDummyInput().appendField(
        new Blockly.FieldDropdown([
          ['+', 'ADD'],
          ['-', 'SUB'],
          ['\u00D7', 'MUL'], // ×
          ['\u00F7', 'DIV'], // ÷
          ['^', 'POW'],
        ]),
        'OP'
      );
      this.appendValueInput('B').setCheck('Number');
      this.setInputsInline(true);
      this.setOutput(true, 'Number');
      this.setColour(MATH_COLOUR);
      this.setTooltip('Arithmetic operation');
      this.setHelpUrl('');
    },
  };

  // Sum of array
  Blockly.Blocks['math_sum'] = {
    init: function () {
      this.appendValueInput('LIST').setCheck('Array').appendField('sum of');
      this.setOutput(true, 'Number');
      this.setColour(MATH_COLOUR);
      this.setTooltip('Sum all numbers in a list');
      this.setHelpUrl('');
    },
  };

  // Average of array
  Blockly.Blocks['math_average'] = {
    init: function () {
      this.appendValueInput('LIST').setCheck('Array').appendField('average of');
      this.setOutput(true, 'Number');
      this.setColour(MATH_COLOUR);
      this.setTooltip('Average of all numbers in a list');
      this.setHelpUrl('');
    },
  };

  // Min/Max
  Blockly.Blocks['math_minmax'] = {
    init: function () {
      this.appendDummyInput().appendField(
        new Blockly.FieldDropdown([
          ['minimum', 'MIN'],
          ['maximum', 'MAX'],
        ]),
        'OP'
      );
      this.appendValueInput('LIST').setCheck('Array').appendField('of');
      this.setInputsInline(true);
      this.setOutput(true, 'Number');
      this.setColour(MATH_COLOUR);
      this.setTooltip('Find minimum or maximum value in a list');
      this.setHelpUrl('');
    },
  };

  // Round
  Blockly.Blocks['math_round'] = {
    init: function () {
      this.appendDummyInput().appendField(
        new Blockly.FieldDropdown([
          ['round', 'ROUND'],
          ['floor', 'FLOOR'],
          ['ceiling', 'CEIL'],
        ]),
        'OP'
      );
      this.appendValueInput('NUM').setCheck('Number');
      this.setInputsInline(true);
      this.setOutput(true, 'Number');
      this.setColour(MATH_COLOUR);
      this.setTooltip('Round a number');
      this.setHelpUrl('');
    },
  };

  // Absolute value
  Blockly.Blocks['math_abs'] = {
    init: function () {
      this.appendValueInput('NUM').setCheck('Number').appendField('absolute value of');
      this.setOutput(true, 'Number');
      this.setColour(MATH_COLOUR);
      this.setTooltip('Absolute value of a number');
      this.setHelpUrl('');
    },
  };

  // Modulo
  Blockly.Blocks['math_modulo'] = {
    init: function () {
      this.appendValueInput('A').setCheck('Number');
      this.appendValueInput('B').setCheck('Number').appendField('mod');
      this.setInputsInline(true);
      this.setOutput(true, 'Number');
      this.setColour(MATH_COLOUR);
      this.setTooltip('Remainder after division');
      this.setHelpUrl('');
    },
  };
}
