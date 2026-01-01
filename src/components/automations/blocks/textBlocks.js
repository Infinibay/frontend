/**
 * Text Blocks
 *
 * String operations: literal, join, length, contains
 */

import * as Blockly from 'blockly';

const TEXT_COLOUR = 160;

export function registerTextBlocks() {
  // Text literal
  Blockly.Blocks['text'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('"')
        .appendField(new Blockly.FieldTextInput(''), 'TEXT')
        .appendField('"');
      this.setOutput(true, 'String');
      this.setColour(TEXT_COLOUR);
      this.setTooltip('A text value');
      this.setHelpUrl('');
    },
  };

  // Text join
  Blockly.Blocks['text_join'] = {
    init: function () {
      this.appendValueInput('A').setCheck('String').appendField('join');
      this.appendValueInput('B').setCheck('String').appendField('and');
      this.setInputsInline(true);
      this.setOutput(true, 'String');
      this.setColour(TEXT_COLOUR);
      this.setTooltip('Combine two texts');
      this.setHelpUrl('');
    },
  };

  // Text length
  Blockly.Blocks['text_length'] = {
    init: function () {
      this.appendValueInput('TEXT').setCheck('String').appendField('length of');
      this.setOutput(true, 'Number');
      this.setColour(TEXT_COLOUR);
      this.setTooltip('Number of characters in text');
      this.setHelpUrl('');
    },
  };

  // Text contains
  Blockly.Blocks['text_contains'] = {
    init: function () {
      this.appendValueInput('TEXT').setCheck('String');
      this.appendValueInput('SEARCH').setCheck('String').appendField('contains');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(TEXT_COLOUR);
      this.setTooltip('Check if text contains a substring');
      this.setHelpUrl('');
    },
  };

  // Text starts with
  Blockly.Blocks['text_starts_with'] = {
    init: function () {
      this.appendValueInput('TEXT').setCheck('String');
      this.appendValueInput('PREFIX').setCheck('String').appendField('starts with');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(TEXT_COLOUR);
      this.setTooltip('Check if text starts with a prefix');
      this.setHelpUrl('');
    },
  };

  // Text ends with
  Blockly.Blocks['text_ends_with'] = {
    init: function () {
      this.appendValueInput('TEXT').setCheck('String');
      this.appendValueInput('SUFFIX').setCheck('String').appendField('ends with');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(TEXT_COLOUR);
      this.setTooltip('Check if text ends with a suffix');
      this.setHelpUrl('');
    },
  };

  // To uppercase
  Blockly.Blocks['text_uppercase'] = {
    init: function () {
      this.appendValueInput('TEXT').setCheck('String').appendField('uppercase of');
      this.setOutput(true, 'String');
      this.setColour(TEXT_COLOUR);
      this.setTooltip('Convert text to uppercase');
      this.setHelpUrl('');
    },
  };

  // To lowercase
  Blockly.Blocks['text_lowercase'] = {
    init: function () {
      this.appendValueInput('TEXT').setCheck('String').appendField('lowercase of');
      this.setOutput(true, 'String');
      this.setColour(TEXT_COLOUR);
      this.setTooltip('Convert text to lowercase');
      this.setHelpUrl('');
    },
  };
}
