/**
 * Action Blocks
 *
 * Actions that the automation can take: trigger, skip, log
 */

import * as Blockly from 'blockly';

const ACTION_COLOUR = 0;

export function registerActionBlocks() {
  // Trigger automation (return true)
  Blockly.Blocks['actions_trigger'] = {
    init: function () {
      this.appendDummyInput().appendField('\u26A1 Trigger automation'); // ⚡
      this.setPreviousStatement(true, null);
      // No next statement - this is a terminal block
      this.setColour(ACTION_COLOUR);
      this.setTooltip(
        'Fires the automation and creates a recommendation. ' +
        'Use this when your conditions are met and you want to notify the user.'
      );
      this.setHelpUrl('');
    },
  };

  // Skip automation (return false)
  Blockly.Blocks['actions_skip'] = {
    init: function () {
      this.appendDummyInput().appendField('\u23ED Skip (don\'t trigger)'); // ⏭
      this.setPreviousStatement(true, null);
      // No next statement - this is a terminal block
      this.setColour(ACTION_COLOUR);
      this.setTooltip(
        'Stops the automation without creating a recommendation. ' +
        'Use this inside conditions when you want to explicitly prevent triggering.'
      );
      this.setHelpUrl('');
    },
  };

  // Log message (for debugging)
  Blockly.Blocks['actions_log'] = {
    init: function () {
      this.appendValueInput('MESSAGE').appendField('\uD83D\uDCDD Log'); // 📝
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(ACTION_COLOUR);
      this.setTooltip(
        'Records a message for testing purposes. ' +
        'Helpful for debugging your automation logic before submitting.'
      );
      this.setHelpUrl('');
    },
  };

  // Set severity
  Blockly.Blocks['actions_set_severity'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Set severity to')
        .appendField(
          new Blockly.FieldDropdown([
            ['\uD83D\uDD35 LOW', 'LOW'], // 🔵
            ['\uD83D\uDFE1 MEDIUM', 'MEDIUM'], // 🟡
            ['\uD83D\uDFE0 HIGH', 'HIGH'], // 🟠
            ['\uD83D\uDD34 CRITICAL', 'CRITICAL'], // 🔴
          ]),
          'SEVERITY'
        );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(ACTION_COLOUR);
      this.setTooltip(
        'Sets how urgent the recommendation appears. ' +
        'LOW: Informational. MEDIUM: Should look at it. HIGH: Needs attention. CRITICAL: Act now!'
      );
      this.setHelpUrl('');
    },
  };

  // Set recommendation message
  Blockly.Blocks['actions_set_message'] = {
    init: function () {
      this.appendValueInput('TITLE').setCheck('String').appendField('Set title to');
      this.appendValueInput('DESCRIPTION')
        .setCheck('String')
        .appendField('description');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(ACTION_COLOUR);
      this.setTooltip(
        'Customizes what the user sees when this automation triggers. ' +
        'The title appears as the heading, description provides more detail.'
      );
      this.setHelpUrl('');
    },
  };

  // Conditional trigger with severity
  Blockly.Blocks['actions_trigger_with_severity'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('\u26A1 Trigger with severity') // ⚡
        .appendField(
          new Blockly.FieldDropdown([
            ['LOW', 'LOW'],
            ['MEDIUM', 'MEDIUM'],
            ['HIGH', 'HIGH'],
            ['CRITICAL', 'CRITICAL'],
          ]),
          'SEVERITY'
        );
      this.setPreviousStatement(true, null);
      this.setColour(ACTION_COLOUR);
      this.setTooltip(
        'Fires the automation with a specific urgency level. ' +
        'Combines "Trigger" and "Set severity" into one convenient block.'
      );
      this.setHelpUrl('');
    },
  };
}
