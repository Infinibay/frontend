/**
 * TypeScript Code Generator for Blockly
 *
 * Generates TypeScript code from Blockly blocks for execution on the backend.
 * The generated code runs in a sandboxed context with access to:
 * - context.metrics (CPU, memory, disk)
 * - context.defender (Windows Defender status)
 * - context.updates (Windows Update status)
 * - context.processes (process information)
 * - Helper functions like getDiskUsagePercent(), getProcessCPU(), etc.
 */

import * as Blockly from 'blockly';

// Create a new generator instance
export const typescriptGenerator = new Blockly.Generator('TypeScript');

// Order of operations (precedence)
typescriptGenerator.ORDER_ATOMIC = 0; // 0 "" ...
typescriptGenerator.ORDER_MEMBER = 1; // . []
typescriptGenerator.ORDER_FUNCTION_CALL = 2; // ()
typescriptGenerator.ORDER_UNARY_NEGATION = 3; // !
typescriptGenerator.ORDER_MULTIPLICATION = 4; // * / %
typescriptGenerator.ORDER_ADDITION = 5; // + -
typescriptGenerator.ORDER_RELATIONAL = 6; // < <= > >=
typescriptGenerator.ORDER_EQUALITY = 7; // == != === !==
typescriptGenerator.ORDER_LOGICAL_AND = 8; // &&
typescriptGenerator.ORDER_LOGICAL_OR = 9; // ||
typescriptGenerator.ORDER_CONDITIONAL = 10; // ?:
typescriptGenerator.ORDER_ASSIGNMENT = 11; // = += -= etc
typescriptGenerator.ORDER_NONE = 99; // (...)

// Initialize for each workspace
typescriptGenerator.init = function (workspace) {
  // Create a dictionary of definitions
  if (!typescriptGenerator.definitions_) {
    typescriptGenerator.definitions_ = Object.create(null);
  }
  if (!typescriptGenerator.nameDB_) {
    typescriptGenerator.nameDB_ = new Blockly.Names(typescriptGenerator.RESERVED_WORDS_);
  } else {
    typescriptGenerator.nameDB_.reset();
  }
};

// Finalize the code
typescriptGenerator.finish = function (code) {
  // Add definitions at the top
  const definitions = [];
  for (const name in typescriptGenerator.definitions_) {
    definitions.push(typescriptGenerator.definitions_[name]);
  }
  // Clean up
  delete typescriptGenerator.definitions_;
  delete typescriptGenerator.nameDB_;

  const prefix = definitions.length > 0 ? definitions.join('\n') + '\n\n' : '';
  return prefix + code;
};

// Scrub naked values (statements that are just expressions)
typescriptGenerator.scrubNakedValue = function (line) {
  return line + ';\n';
};

// Indent code
typescriptGenerator.INDENT = '  ';

// ═══════════════════════════════════════════════════════════════
// HEALTH BLOCKS - CPU
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['health_cpu_usage'] = function () {
  return ['context.metrics.cpuUsagePercent', typescriptGenerator.ORDER_MEMBER];
};

typescriptGenerator.forBlock['health_cpu_core_usage'] = function (block) {
  const core = block.getFieldValue('CORE');
  return [`(context.metrics.cpuCoresUsage[${core}] ?? 0)`, typescriptGenerator.ORDER_MEMBER];
};

typescriptGenerator.forBlock['health_cpu_temperature'] = function () {
  return ['(context.metrics.cpuTemperature ?? 0)', typescriptGenerator.ORDER_MEMBER];
};

// ═══════════════════════════════════════════════════════════════
// HEALTH BLOCKS - MEMORY
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['health_memory_usage'] = function () {
  return [
    '((context.metrics.usedMemoryKB / context.metrics.totalMemoryKB) * 100)',
    typescriptGenerator.ORDER_MULTIPLICATION,
  ];
};

typescriptGenerator.forBlock['health_memory_available_gb'] = function () {
  return ['(context.metrics.availableMemoryKB / 1024 / 1024)', typescriptGenerator.ORDER_DIVISION];
};

typescriptGenerator.forBlock['health_swap_usage'] = function () {
  return [
    '((context.metrics.swapUsedKB / context.metrics.swapTotalKB) * 100)',
    typescriptGenerator.ORDER_MULTIPLICATION,
  ];
};

// ═══════════════════════════════════════════════════════════════
// HEALTH BLOCKS - DISK
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['health_disk_usage'] = function (block) {
  const drive = block.getFieldValue('DRIVE');
  return [
    `context.getDiskUsagePercent('${drive}')`,
    typescriptGenerator.ORDER_FUNCTION_CALL,
  ];
};

typescriptGenerator.forBlock['health_disk_free_gb'] = function (block) {
  const drive = block.getFieldValue('DRIVE');
  return [
    `context.getDiskFreeGB('${drive}')`,
    typescriptGenerator.ORDER_FUNCTION_CALL,
  ];
};

typescriptGenerator.forBlock['health_disk_total_gb'] = function (block) {
  const drive = block.getFieldValue('DRIVE');
  return [
    `context.getDiskTotalGB('${drive}')`,
    typescriptGenerator.ORDER_FUNCTION_CALL,
  ];
};

typescriptGenerator.forBlock['health_all_disks'] = function () {
  return ['context.disks', typescriptGenerator.ORDER_MEMBER];
};

// ═══════════════════════════════════════════════════════════════
// HEALTH BLOCKS - PROCESSES
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['health_process_running'] = function (block) {
  const process = block.getFieldValue('PROCESS');
  return [
    `context.isProcessRunning('${process}')`,
    typescriptGenerator.ORDER_FUNCTION_CALL,
  ];
};

typescriptGenerator.forBlock['health_process_cpu'] = function (block) {
  const process = block.getFieldValue('PROCESS');
  return [
    `context.getProcessCPU('${process}')`,
    typescriptGenerator.ORDER_FUNCTION_CALL,
  ];
};

typescriptGenerator.forBlock['health_process_memory'] = function (block) {
  const process = block.getFieldValue('PROCESS');
  return [
    `(context.getProcessMemoryKB('${process}') / 1024)`,
    typescriptGenerator.ORDER_DIVISION,
  ];
};

typescriptGenerator.forBlock['health_high_cpu_processes'] = function (block) {
  const threshold = block.getFieldValue('THRESHOLD');
  return [
    `context.getHighCPUProcesses(${threshold})`,
    typescriptGenerator.ORDER_FUNCTION_CALL,
  ];
};

typescriptGenerator.forBlock['health_high_memory_processes'] = function (block) {
  const threshold = block.getFieldValue('THRESHOLD');
  return [
    `context.getHighMemoryProcesses(${threshold} * 1024)`,
    typescriptGenerator.ORDER_FUNCTION_CALL,
  ];
};

typescriptGenerator.forBlock['health_process_count'] = function () {
  return ['context.processes.length', typescriptGenerator.ORDER_MEMBER];
};

// ═══════════════════════════════════════════════════════════════
// HEALTH BLOCKS - DEFENDER
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['health_defender_enabled'] = function () {
  return ['context.defender.isEnabled', typescriptGenerator.ORDER_MEMBER];
};

typescriptGenerator.forBlock['health_defender_realtime'] = function () {
  return ['context.defender.realTimeProtection', typescriptGenerator.ORDER_MEMBER];
};

typescriptGenerator.forBlock['health_defender_threats'] = function () {
  return ['context.defender.threatCount', typescriptGenerator.ORDER_MEMBER];
};

typescriptGenerator.forBlock['health_defender_last_scan_days'] = function () {
  return ['context.defender.daysSinceLastScan', typescriptGenerator.ORDER_MEMBER];
};

// ═══════════════════════════════════════════════════════════════
// HEALTH BLOCKS - UPDATES
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['health_pending_updates'] = function () {
  return ['context.updates.pendingCount', typescriptGenerator.ORDER_MEMBER];
};

typescriptGenerator.forBlock['health_updates_critical'] = function () {
  return ['context.updates.criticalCount', typescriptGenerator.ORDER_MEMBER];
};

typescriptGenerator.forBlock['health_days_since_update'] = function () {
  return ['context.updates.daysSinceLastUpdate', typescriptGenerator.ORDER_MEMBER];
};

// ═══════════════════════════════════════════════════════════════
// HEALTH BLOCKS - SYSTEM
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['health_uptime_hours'] = function () {
  return ['(context.metrics.uptime / 3600)', typescriptGenerator.ORDER_DIVISION];
};

typescriptGenerator.forBlock['health_vm_name'] = function () {
  return ['context.vmName', typescriptGenerator.ORDER_MEMBER];
};

// ═══════════════════════════════════════════════════════════════
// HEALTH BLOCKS - NETWORK
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['health_blocked_connections'] = function () {
  return ['context.blockedConnections', typescriptGenerator.ORDER_MEMBER];
};

typescriptGenerator.forBlock['health_blocked_connections_count'] = function () {
  return ['context.blockedConnections.length', typescriptGenerator.ORDER_MEMBER];
};

// ═══════════════════════════════════════════════════════════════
// LOGIC BLOCKS
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['logic_and'] = function (block) {
  const a = typescriptGenerator.valueToCode(block, 'A', typescriptGenerator.ORDER_LOGICAL_AND) || 'false';
  const b = typescriptGenerator.valueToCode(block, 'B', typescriptGenerator.ORDER_LOGICAL_AND) || 'false';
  return [`(${a} && ${b})`, typescriptGenerator.ORDER_LOGICAL_AND];
};

typescriptGenerator.forBlock['logic_or'] = function (block) {
  const a = typescriptGenerator.valueToCode(block, 'A', typescriptGenerator.ORDER_LOGICAL_OR) || 'false';
  const b = typescriptGenerator.valueToCode(block, 'B', typescriptGenerator.ORDER_LOGICAL_OR) || 'false';
  return [`(${a} || ${b})`, typescriptGenerator.ORDER_LOGICAL_OR];
};

typescriptGenerator.forBlock['logic_not'] = function (block) {
  const value = typescriptGenerator.valueToCode(block, 'VALUE', typescriptGenerator.ORDER_UNARY_NEGATION) || 'false';
  return [`!${value}`, typescriptGenerator.ORDER_UNARY_NEGATION];
};

typescriptGenerator.forBlock['logic_true'] = function () {
  return ['true', typescriptGenerator.ORDER_ATOMIC];
};

typescriptGenerator.forBlock['logic_false'] = function () {
  return ['false', typescriptGenerator.ORDER_ATOMIC];
};

typescriptGenerator.forBlock['logic_if'] = function (block) {
  const condition = typescriptGenerator.valueToCode(block, 'CONDITION', typescriptGenerator.ORDER_NONE) || 'false';
  const doCode = typescriptGenerator.statementToCode(block, 'DO');
  return `if (${condition}) {\n${doCode}}\n`;
};

typescriptGenerator.forBlock['logic_if_else'] = function (block) {
  const condition = typescriptGenerator.valueToCode(block, 'CONDITION', typescriptGenerator.ORDER_NONE) || 'false';
  const trueCode = typescriptGenerator.statementToCode(block, 'DO_TRUE');
  const falseCode = typescriptGenerator.statementToCode(block, 'DO_FALSE');
  return `if (${condition}) {\n${trueCode}} else {\n${falseCode}}\n`;
};

// ═══════════════════════════════════════════════════════════════
// COMPARISON BLOCKS
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['comparison_number'] = function (block) {
  const operators = {
    EQ: '===',
    NEQ: '!==',
    LT: '<',
    LTE: '<=',
    GT: '>',
    GTE: '>=',
  };
  const op = operators[block.getFieldValue('OP')];
  const a = typescriptGenerator.valueToCode(block, 'A', typescriptGenerator.ORDER_RELATIONAL) || '0';
  const b = typescriptGenerator.valueToCode(block, 'B', typescriptGenerator.ORDER_RELATIONAL) || '0';
  return [`(${a} ${op} ${b})`, typescriptGenerator.ORDER_RELATIONAL];
};

typescriptGenerator.forBlock['comparison_between'] = function (block) {
  const value = typescriptGenerator.valueToCode(block, 'VALUE', typescriptGenerator.ORDER_RELATIONAL) || '0';
  const min = typescriptGenerator.valueToCode(block, 'MIN', typescriptGenerator.ORDER_RELATIONAL) || '0';
  const max = typescriptGenerator.valueToCode(block, 'MAX', typescriptGenerator.ORDER_RELATIONAL) || '0';
  return [`(${value} >= ${min} && ${value} <= ${max})`, typescriptGenerator.ORDER_LOGICAL_AND];
};

typescriptGenerator.forBlock['comparison_text'] = function (block) {
  const op = block.getFieldValue('OP');
  const a = typescriptGenerator.valueToCode(block, 'A', typescriptGenerator.ORDER_MEMBER) || "''";
  const b = typescriptGenerator.valueToCode(block, 'B', typescriptGenerator.ORDER_MEMBER) || "''";

  switch (op) {
    case 'EQ':
      return [`(${a} === ${b})`, typescriptGenerator.ORDER_EQUALITY];
    case 'NEQ':
      return [`(${a} !== ${b})`, typescriptGenerator.ORDER_EQUALITY];
    case 'CONTAINS':
      return [`${a}.includes(${b})`, typescriptGenerator.ORDER_FUNCTION_CALL];
    case 'STARTS':
      return [`${a}.startsWith(${b})`, typescriptGenerator.ORDER_FUNCTION_CALL];
    case 'ENDS':
      return [`${a}.endsWith(${b})`, typescriptGenerator.ORDER_FUNCTION_CALL];
    default:
      return ['false', typescriptGenerator.ORDER_ATOMIC];
  }
};

typescriptGenerator.forBlock['comparison_text_equals'] = function (block) {
  const a = typescriptGenerator.valueToCode(block, 'A', typescriptGenerator.ORDER_EQUALITY) || "''";
  const b = typescriptGenerator.valueToCode(block, 'B', typescriptGenerator.ORDER_EQUALITY) || "''";
  return [`(${a} === ${b})`, typescriptGenerator.ORDER_EQUALITY];
};

typescriptGenerator.forBlock['comparison_is_empty'] = function (block) {
  const value = typescriptGenerator.valueToCode(block, 'VALUE', typescriptGenerator.ORDER_NONE) || 'null';
  return [`(${value} == null || ${value} === '')`, typescriptGenerator.ORDER_LOGICAL_OR];
};

// ═══════════════════════════════════════════════════════════════
// ARRAY BLOCKS
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['array_is_empty'] = function (block) {
  const list = typescriptGenerator.valueToCode(block, 'LIST', typescriptGenerator.ORDER_MEMBER) || '[]';
  return [`(${list}.length === 0)`, typescriptGenerator.ORDER_EQUALITY];
};

typescriptGenerator.forBlock['array_length'] = function (block) {
  const list = typescriptGenerator.valueToCode(block, 'LIST', typescriptGenerator.ORDER_MEMBER) || '[]';
  return [`${list}.length`, typescriptGenerator.ORDER_MEMBER];
};

typescriptGenerator.forBlock['array_contains'] = function (block) {
  const list = typescriptGenerator.valueToCode(block, 'LIST', typescriptGenerator.ORDER_MEMBER) || '[]';
  const item = typescriptGenerator.valueToCode(block, 'ITEM', typescriptGenerator.ORDER_NONE) || 'null';
  return [`${list}.includes(${item})`, typescriptGenerator.ORDER_FUNCTION_CALL];
};

// ═══════════════════════════════════════════════════════════════
// MATH BLOCKS
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['math_number'] = function (block) {
  const num = Number(block.getFieldValue('NUM'));
  return [String(num), typescriptGenerator.ORDER_ATOMIC];
};

typescriptGenerator.forBlock['math_arithmetic'] = function (block) {
  const operators = {
    ADD: ['+', typescriptGenerator.ORDER_ADDITION],
    SUB: ['-', typescriptGenerator.ORDER_ADDITION],
    MUL: ['*', typescriptGenerator.ORDER_MULTIPLICATION],
    DIV: ['/', typescriptGenerator.ORDER_MULTIPLICATION],
    POW: ['**', typescriptGenerator.ORDER_NONE],
  };
  const tuple = operators[block.getFieldValue('OP')];
  const op = tuple[0];
  const order = tuple[1];
  const a = typescriptGenerator.valueToCode(block, 'A', order) || '0';
  const b = typescriptGenerator.valueToCode(block, 'B', order) || '0';
  return [`(${a} ${op} ${b})`, order];
};

typescriptGenerator.forBlock['math_sum'] = function (block) {
  const list = typescriptGenerator.valueToCode(block, 'LIST', typescriptGenerator.ORDER_MEMBER) || '[]';
  return [`${list}.reduce((a, b) => a + b, 0)`, typescriptGenerator.ORDER_FUNCTION_CALL];
};

typescriptGenerator.forBlock['math_average'] = function (block) {
  const list = typescriptGenerator.valueToCode(block, 'LIST', typescriptGenerator.ORDER_MEMBER) || '[]';
  return [
    `(${list}.reduce((a, b) => a + b, 0) / ${list}.length)`,
    typescriptGenerator.ORDER_MULTIPLICATION,
  ];
};

typescriptGenerator.forBlock['math_minmax'] = function (block) {
  const op = block.getFieldValue('OP');
  const list = typescriptGenerator.valueToCode(block, 'LIST', typescriptGenerator.ORDER_NONE) || '[]';
  const fn = op === 'MIN' ? 'Math.min' : 'Math.max';
  return [`${fn}(...${list})`, typescriptGenerator.ORDER_FUNCTION_CALL];
};

typescriptGenerator.forBlock['math_round'] = function (block) {
  const ops = { ROUND: 'round', FLOOR: 'floor', CEIL: 'ceil' };
  const fn = ops[block.getFieldValue('OP')];
  const num = typescriptGenerator.valueToCode(block, 'NUM', typescriptGenerator.ORDER_NONE) || '0';
  return [`Math.${fn}(${num})`, typescriptGenerator.ORDER_FUNCTION_CALL];
};

typescriptGenerator.forBlock['math_abs'] = function (block) {
  const num = typescriptGenerator.valueToCode(block, 'NUM', typescriptGenerator.ORDER_NONE) || '0';
  return [`Math.abs(${num})`, typescriptGenerator.ORDER_FUNCTION_CALL];
};

typescriptGenerator.forBlock['math_modulo'] = function (block) {
  const a = typescriptGenerator.valueToCode(block, 'A', typescriptGenerator.ORDER_MULTIPLICATION) || '0';
  const b = typescriptGenerator.valueToCode(block, 'B', typescriptGenerator.ORDER_MULTIPLICATION) || '1';
  return [`(${a} % ${b})`, typescriptGenerator.ORDER_MULTIPLICATION];
};

// ═══════════════════════════════════════════════════════════════
// TEXT BLOCKS
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['text'] = function (block) {
  const text = block.getFieldValue('TEXT');
  const escaped = text.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return [`'${escaped}'`, typescriptGenerator.ORDER_ATOMIC];
};

typescriptGenerator.forBlock['text_join'] = function (block) {
  const a = typescriptGenerator.valueToCode(block, 'A', typescriptGenerator.ORDER_ADDITION) || "''";
  const b = typescriptGenerator.valueToCode(block, 'B', typescriptGenerator.ORDER_ADDITION) || "''";
  return [`(${a} + ${b})`, typescriptGenerator.ORDER_ADDITION];
};

typescriptGenerator.forBlock['text_length'] = function (block) {
  const text = typescriptGenerator.valueToCode(block, 'TEXT', typescriptGenerator.ORDER_MEMBER) || "''";
  return [`${text}.length`, typescriptGenerator.ORDER_MEMBER];
};

typescriptGenerator.forBlock['text_contains'] = function (block) {
  const text = typescriptGenerator.valueToCode(block, 'TEXT', typescriptGenerator.ORDER_MEMBER) || "''";
  const search = typescriptGenerator.valueToCode(block, 'SEARCH', typescriptGenerator.ORDER_NONE) || "''";
  return [`${text}.includes(${search})`, typescriptGenerator.ORDER_FUNCTION_CALL];
};

typescriptGenerator.forBlock['text_starts_with'] = function (block) {
  const text = typescriptGenerator.valueToCode(block, 'TEXT', typescriptGenerator.ORDER_MEMBER) || "''";
  const prefix = typescriptGenerator.valueToCode(block, 'PREFIX', typescriptGenerator.ORDER_NONE) || "''";
  return [`${text}.startsWith(${prefix})`, typescriptGenerator.ORDER_FUNCTION_CALL];
};

typescriptGenerator.forBlock['text_ends_with'] = function (block) {
  const text = typescriptGenerator.valueToCode(block, 'TEXT', typescriptGenerator.ORDER_MEMBER) || "''";
  const suffix = typescriptGenerator.valueToCode(block, 'SUFFIX', typescriptGenerator.ORDER_NONE) || "''";
  return [`${text}.endsWith(${suffix})`, typescriptGenerator.ORDER_FUNCTION_CALL];
};

typescriptGenerator.forBlock['text_uppercase'] = function (block) {
  const text = typescriptGenerator.valueToCode(block, 'TEXT', typescriptGenerator.ORDER_MEMBER) || "''";
  return [`${text}.toUpperCase()`, typescriptGenerator.ORDER_FUNCTION_CALL];
};

typescriptGenerator.forBlock['text_lowercase'] = function (block) {
  const text = typescriptGenerator.valueToCode(block, 'TEXT', typescriptGenerator.ORDER_MEMBER) || "''";
  return [`${text}.toLowerCase()`, typescriptGenerator.ORDER_FUNCTION_CALL];
};

// ═══════════════════════════════════════════════════════════════
// LOOP BLOCKS
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['loops_foreach'] = function (block) {
  const variable = block.getFieldValue('VAR');
  const list = typescriptGenerator.valueToCode(block, 'LIST', typescriptGenerator.ORDER_MEMBER) || '[]';
  const doCode = typescriptGenerator.statementToCode(block, 'DO');
  return `for (const ${variable} of ${list}) {\n${doCode}}\n`;
};

typescriptGenerator.forBlock['loops_repeat'] = function (block) {
  const times = typescriptGenerator.valueToCode(block, 'TIMES', typescriptGenerator.ORDER_RELATIONAL) || '0';
  const doCode = typescriptGenerator.statementToCode(block, 'DO');
  return `for (let i = 0; i < ${times}; i++) {\n${doCode}}\n`;
};

typescriptGenerator.forBlock['loops_while'] = function (block) {
  const condition = typescriptGenerator.valueToCode(block, 'CONDITION', typescriptGenerator.ORDER_NONE) || 'false';
  const doCode = typescriptGenerator.statementToCode(block, 'DO');
  return `while (${condition}) {\n${doCode}}\n`;
};

typescriptGenerator.forBlock['loops_break'] = function () {
  return 'break;\n';
};

typescriptGenerator.forBlock['loops_continue'] = function () {
  return 'continue;\n';
};

typescriptGenerator.forBlock['loops_array_length'] = function (block) {
  const list = typescriptGenerator.valueToCode(block, 'LIST', typescriptGenerator.ORDER_MEMBER) || '[]';
  return [`${list}.length`, typescriptGenerator.ORDER_MEMBER];
};

typescriptGenerator.forBlock['loops_array_get'] = function (block) {
  const list = typescriptGenerator.valueToCode(block, 'LIST', typescriptGenerator.ORDER_MEMBER) || '[]';
  const index = typescriptGenerator.valueToCode(block, 'INDEX', typescriptGenerator.ORDER_NONE) || '0';
  return [`${list}[${index}]`, typescriptGenerator.ORDER_MEMBER];
};

// ═══════════════════════════════════════════════════════════════
// VARIABLE BLOCKS
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['variables_set'] = function (block) {
  const variable = block.getFieldValue('VAR');
  const value = typescriptGenerator.valueToCode(block, 'VALUE', typescriptGenerator.ORDER_ASSIGNMENT) || '0';
  return `let ${variable} = ${value};\n`;
};

typescriptGenerator.forBlock['variables_get'] = function (block) {
  const variable = block.getFieldValue('VAR');
  return [variable, typescriptGenerator.ORDER_ATOMIC];
};

typescriptGenerator.forBlock['variables_change'] = function (block) {
  const variable = block.getFieldValue('VAR');
  const delta = typescriptGenerator.valueToCode(block, 'DELTA', typescriptGenerator.ORDER_ADDITION) || '0';
  return `${variable} += ${delta};\n`;
};

typescriptGenerator.forBlock['variables_increment'] = function (block) {
  const variable = block.getFieldValue('VAR');
  return `${variable}++;\n`;
};

typescriptGenerator.forBlock['variables_decrement'] = function (block) {
  const variable = block.getFieldValue('VAR');
  return `${variable}--;\n`;
};

// ═══════════════════════════════════════════════════════════════
// ACTION BLOCKS
// ═══════════════════════════════════════════════════════════════

typescriptGenerator.forBlock['actions_trigger'] = function () {
  return 'return true;\n';
};

typescriptGenerator.forBlock['actions_skip'] = function () {
  return 'return false;\n';
};

typescriptGenerator.forBlock['actions_log'] = function (block) {
  const message = typescriptGenerator.valueToCode(block, 'MESSAGE', typescriptGenerator.ORDER_NONE) || "''";
  return `context.log(${message});\n`;
};

typescriptGenerator.forBlock['actions_set_severity'] = function (block) {
  const severity = block.getFieldValue('SEVERITY');
  return `context.setSeverity('${severity}');\n`;
};

typescriptGenerator.forBlock['actions_set_message'] = function (block) {
  const title = typescriptGenerator.valueToCode(block, 'TITLE', typescriptGenerator.ORDER_NONE) || "''";
  const description = typescriptGenerator.valueToCode(block, 'DESCRIPTION', typescriptGenerator.ORDER_NONE) || "''";
  return `context.setMessage(${title}, ${description});\n`;
};

typescriptGenerator.forBlock['actions_trigger_with_severity'] = function (block) {
  const severity = block.getFieldValue('SEVERITY');
  return `context.setSeverity('${severity}');\nreturn true;\n`;
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTION
// ═══════════════════════════════════════════════════════════════

/**
 * Generate code from a Blockly workspace.
 * @param {Blockly.Workspace} workspace - The Blockly workspace
 * @returns {string} The generated TypeScript code
 */
export function generateCode(workspace) {
  if (!workspace) {
    return '// Empty workspace\nreturn false;';
  }

  try {
    const code = typescriptGenerator.workspaceToCode(workspace);
    if (!code || code.trim() === '') {
      return '// No blocks connected\nreturn false;';
    }
    return code;
  } catch (error) {
    console.error('Error generating code:', error);
    return `// Error generating code: ${error.message}\nreturn false;`;
  }
}
