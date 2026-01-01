/**
 * Comparison Blocks
 *
 * Numeric comparisons, text comparisons, and array operations.
 */

import * as Blockly from 'blockly';

const COMPARISON_COLOUR = 230;
const ARRAY_COLOUR = 260;

export function registerComparisonBlocks() {
  // ═══════════════════════════════════════════════════════════════════════
  // NUMERIC COMPARISON
  // ═══════════════════════════════════════════════════════════════════════

  Blockly.Blocks['comparison_number'] = {
    init: function () {
      this.appendValueInput('A').setCheck('Number');
      this.appendDummyInput().appendField(
        new Blockly.FieldDropdown([
          ['=', 'EQ'],
          ['\u2260', 'NEQ'], // ≠
          ['<', 'LT'],
          ['\u2264', 'LTE'], // ≤
          ['>', 'GT'],
          ['\u2265', 'GTE'], // ≥
        ]),
        'OP'
      );
      this.appendValueInput('B').setCheck('Number');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(COMPARISON_COLOUR);
      this.setTooltip(
        'Compare two numbers using operators like greater than (>), less than (<), equals (=). ' +
        'Example: Check if CPU Usage > 90.'
      );
      this.setHelpUrl('');
    },
  };

  // ═══════════════════════════════════════════════════════════════════════
  // BETWEEN
  // ═══════════════════════════════════════════════════════════════════════

  Blockly.Blocks['comparison_between'] = {
    init: function () {
      this.appendValueInput('VALUE').setCheck('Number');
      this.appendValueInput('MIN').setCheck('Number').appendField('is between');
      this.appendValueInput('MAX').setCheck('Number').appendField('and');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(COMPARISON_COLOUR);
      this.setTooltip(
        'Checks if a number falls within a range (includes both endpoints). ' +
        'Example: Memory between 50 and 80 means 50%, 65%, or 80% would all match.'
      );
      this.setHelpUrl('');
    },
  };

  // ═══════════════════════════════════════════════════════════════════════
  // TEXT COMPARISON
  // ═══════════════════════════════════════════════════════════════════════

  Blockly.Blocks['comparison_text'] = {
    init: function () {
      this.appendValueInput('A').setCheck('String');
      this.appendDummyInput().appendField(
        new Blockly.FieldDropdown([
          ['equals', 'EQ'],
          ['not equals', 'NEQ'],
          ['contains', 'CONTAINS'],
          ['starts with', 'STARTS'],
          ['ends with', 'ENDS'],
        ]),
        'OP'
      );
      this.appendValueInput('B').setCheck('String');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(COMPARISON_COLOUR);
      this.setTooltip(
        'Compare text values. "contains" checks if one text appears inside another. ' +
        'Example: Check if VM Name contains "production".'
      );
      this.setHelpUrl('');
    },
  };

  // Keep backward compatibility with old block name
  Blockly.Blocks['comparison_text_equals'] = {
    init: function () {
      this.appendValueInput('A').setCheck('String');
      this.appendValueInput('B').setCheck('String').appendField('equals');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(COMPARISON_COLOUR);
      this.setTooltip('True only if both texts are exactly the same (case-sensitive).');
      this.setHelpUrl('');
    },
  };

  // Is null / empty
  Blockly.Blocks['comparison_is_empty'] = {
    init: function () {
      this.appendValueInput('VALUE').appendField('is empty');
      this.setOutput(true, 'Boolean');
      this.setColour(COMPARISON_COLOUR);
      this.setTooltip(
        'Checks if a value has no content. ' +
        'Useful for checking if optional data is missing.'
      );
      this.setHelpUrl('');
    },
  };

  // ═══════════════════════════════════════════════════════════════════════
  // ARRAY OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  Blockly.Blocks['array_is_empty'] = {
    init: function () {
      this.appendValueInput('LIST').setCheck('Array');
      this.appendDummyInput().appendField('is empty');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(ARRAY_COLOUR);
      this.setTooltip(
        'True if the list has zero items. ' +
        'Example: "High CPU Processes is empty" means no apps are using too much CPU.'
      );
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['array_length'] = {
    init: function () {
      this.appendValueInput('LIST').setCheck('Array').appendField('length of');
      this.setOutput(true, 'Number');
      this.setColour(ARRAY_COLOUR);
      this.setTooltip(
        'Returns how many items are in a list. ' +
        'Use with comparison blocks: "length of blocked connections > 5".'
      );
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['array_contains'] = {
    init: function () {
      this.appendValueInput('LIST').setCheck('Array');
      this.appendValueInput('ITEM').appendField('contains');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(ARRAY_COLOUR);
      this.setTooltip(
        'Checks if a specific item exists in the list. ' +
        'Example: Check if a particular process name appears in the running processes.'
      );
      this.setHelpUrl('');
    },
  };
}
