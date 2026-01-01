/**
 * Health Data Blocks
 *
 * Blocks for accessing VM health metrics like CPU, memory, disk, defender, etc.
 */

import * as Blockly from 'blockly';

const HEALTH_COLOUR = 160;
const DEFENDER_COLOUR = 0;
const UPDATES_COLOUR = 45;
const SYSTEM_COLOUR = 180;
const PROCESS_COLOUR = 260;
const NETWORK_COLOUR = 0;

export function registerHealthBlocks() {
  // ═══════════════════════════════════════════════════════════════════════
  // CPU BLOCKS
  // ═══════════════════════════════════════════════════════════════════════

  Blockly.Blocks['health_cpu_usage'] = {
    init: function () {
      this.appendDummyInput().appendField('🖥️ CPU Usage %');
      this.setOutput(true, 'Number');
      this.setColour(HEALTH_COLOUR);
      this.setTooltip('Current CPU usage as a percentage (0-100)');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_cpu_core_usage'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🖥️ CPU Core')
        .appendField(new Blockly.FieldNumber(0, 0, 64, 1), 'CORE')
        .appendField('Usage %');
      this.setOutput(true, 'Number');
      this.setColour(HEALTH_COLOUR);
      this.setTooltip('Usage percentage of a specific CPU core');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_cpu_temperature'] = {
    init: function () {
      this.appendDummyInput().appendField('🌡️ CPU Temperature °C');
      this.setOutput(true, 'Number');
      this.setColour(HEALTH_COLOUR);
      this.setTooltip('Current CPU temperature in Celsius');
      this.setHelpUrl('');
    },
  };

  // ═══════════════════════════════════════════════════════════════════════
  // MEMORY BLOCKS
  // ═══════════════════════════════════════════════════════════════════════

  Blockly.Blocks['health_memory_usage'] = {
    init: function () {
      this.appendDummyInput().appendField('💾 Memory Usage %');
      this.setOutput(true, 'Number');
      this.setColour(HEALTH_COLOUR);
      this.setTooltip('Current memory usage as a percentage (0-100)');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_memory_available_gb'] = {
    init: function () {
      this.appendDummyInput().appendField('💾 Available Memory (GB)');
      this.setOutput(true, 'Number');
      this.setColour(HEALTH_COLOUR);
      this.setTooltip('Available memory in gigabytes');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_swap_usage'] = {
    init: function () {
      this.appendDummyInput().appendField('💾 Swap Usage %');
      this.setOutput(true, 'Number');
      this.setColour(HEALTH_COLOUR);
      this.setTooltip('Swap/page file usage percentage');
      this.setHelpUrl('');
    },
  };

  // ═══════════════════════════════════════════════════════════════════════
  // DISK BLOCKS
  // ═══════════════════════════════════════════════════════════════════════

  Blockly.Blocks['health_disk_usage'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('💿 Disk')
        .appendField(new Blockly.FieldTextInput('C:'), 'DRIVE')
        .appendField('Usage %');
      this.setOutput(true, 'Number');
      this.setColour(HEALTH_COLOUR);
      this.setTooltip('Disk usage percentage for the specified drive');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_disk_free_gb'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('💿 Free space on')
        .appendField(new Blockly.FieldTextInput('C:'), 'DRIVE')
        .appendField('(GB)');
      this.setOutput(true, 'Number');
      this.setColour(HEALTH_COLOUR);
      this.setTooltip('Free disk space in gigabytes');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_disk_total_gb'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('💿 Total size of')
        .appendField(new Blockly.FieldTextInput('C:'), 'DRIVE')
        .appendField('(GB)');
      this.setOutput(true, 'Number');
      this.setColour(HEALTH_COLOUR);
      this.setTooltip('Total disk size in gigabytes');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_all_disks'] = {
    init: function () {
      this.appendDummyInput().appendField('💿 All disks');
      this.setOutput(true, 'Array');
      this.setColour(PROCESS_COLOUR);
      this.setTooltip('List of all disk drives with their info');
      this.setHelpUrl('');
    },
  };

  // ═══════════════════════════════════════════════════════════════════════
  // PROCESS BLOCKS
  // ═══════════════════════════════════════════════════════════════════════

  Blockly.Blocks['health_process_running'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('⚙️ Process')
        .appendField(new Blockly.FieldTextInput('notepad'), 'PROCESS')
        .appendField('is running');
      this.setOutput(true, 'Boolean');
      this.setColour(HEALTH_COLOUR);
      this.setTooltip('Check if a process is currently running');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_process_cpu'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('⚙️ CPU % of process')
        .appendField(new Blockly.FieldTextInput('chrome'), 'PROCESS');
      this.setOutput(true, 'Number');
      this.setColour(HEALTH_COLOUR);
      this.setTooltip('CPU usage percentage of a specific process');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_process_memory'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('⚙️ Memory (MB) of process')
        .appendField(new Blockly.FieldTextInput('chrome'), 'PROCESS');
      this.setOutput(true, 'Number');
      this.setColour(HEALTH_COLOUR);
      this.setTooltip('Memory usage in MB of a specific process');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_high_cpu_processes'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('⚙️ Processes with CPU >')
        .appendField(new Blockly.FieldNumber(50, 0, 100, 1), 'THRESHOLD')
        .appendField('%');
      this.setOutput(true, 'Array');
      this.setColour(PROCESS_COLOUR);
      this.setTooltip('List of processes exceeding the CPU threshold');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_high_memory_processes'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('⚙️ Processes using >')
        .appendField(new Blockly.FieldNumber(500, 0, 32000, 100), 'THRESHOLD')
        .appendField('MB memory');
      this.setOutput(true, 'Array');
      this.setColour(PROCESS_COLOUR);
      this.setTooltip('List of processes exceeding the memory threshold');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_process_count'] = {
    init: function () {
      this.appendDummyInput().appendField('⚙️ Total running processes');
      this.setOutput(true, 'Number');
      this.setColour(HEALTH_COLOUR);
      this.setTooltip('Number of running processes');
      this.setHelpUrl('');
    },
  };

  // ═══════════════════════════════════════════════════════════════════════
  // WINDOWS DEFENDER BLOCKS
  // ═══════════════════════════════════════════════════════════════════════

  Blockly.Blocks['health_defender_enabled'] = {
    init: function () {
      this.appendDummyInput().appendField('🛡️ Windows Defender enabled');
      this.setOutput(true, 'Boolean');
      this.setColour(DEFENDER_COLOUR);
      this.setTooltip('Check if Windows Defender is enabled');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_defender_realtime'] = {
    init: function () {
      this.appendDummyInput().appendField('🛡️ Real-time protection enabled');
      this.setOutput(true, 'Boolean');
      this.setColour(DEFENDER_COLOUR);
      this.setTooltip('Check if real-time protection is enabled');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_defender_threats'] = {
    init: function () {
      this.appendDummyInput().appendField('🛡️ Detected threat count');
      this.setOutput(true, 'Number');
      this.setColour(DEFENDER_COLOUR);
      this.setTooltip('Number of threats detected by Windows Defender');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_defender_last_scan_days'] = {
    init: function () {
      this.appendDummyInput().appendField('🛡️ Days since last scan');
      this.setOutput(true, 'Number');
      this.setColour(DEFENDER_COLOUR);
      this.setTooltip('Number of days since the last Defender scan');
      this.setHelpUrl('');
    },
  };

  // ═══════════════════════════════════════════════════════════════════════
  // WINDOWS UPDATE BLOCKS
  // ═══════════════════════════════════════════════════════════════════════

  Blockly.Blocks['health_pending_updates'] = {
    init: function () {
      this.appendDummyInput().appendField('🔄 Pending updates');
      this.setOutput(true, 'Number');
      this.setColour(UPDATES_COLOUR);
      this.setTooltip('Number of pending Windows updates');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_updates_critical'] = {
    init: function () {
      this.appendDummyInput().appendField('🔄 Critical updates pending');
      this.setOutput(true, 'Number');
      this.setColour(UPDATES_COLOUR);
      this.setTooltip('Number of critical/security updates pending');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_days_since_update'] = {
    init: function () {
      this.appendDummyInput().appendField('🔄 Days since last update');
      this.setOutput(true, 'Number');
      this.setColour(UPDATES_COLOUR);
      this.setTooltip('Number of days since Windows was last updated');
      this.setHelpUrl('');
    },
  };

  // ═══════════════════════════════════════════════════════════════════════
  // SYSTEM BLOCKS
  // ═══════════════════════════════════════════════════════════════════════

  Blockly.Blocks['health_uptime_hours'] = {
    init: function () {
      this.appendDummyInput().appendField('⏱️ System uptime (hours)');
      this.setOutput(true, 'Number');
      this.setColour(SYSTEM_COLOUR);
      this.setTooltip('How long the system has been running in hours');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_vm_name'] = {
    init: function () {
      this.appendDummyInput().appendField('📛 VM Name');
      this.setOutput(true, 'String');
      this.setColour(SYSTEM_COLOUR);
      this.setTooltip('Name of the virtual machine');
      this.setHelpUrl('');
    },
  };

  // ═══════════════════════════════════════════════════════════════════════
  // NETWORK BLOCKS
  // ═══════════════════════════════════════════════════════════════════════

  Blockly.Blocks['health_blocked_connections'] = {
    init: function () {
      this.appendDummyInput().appendField('🔒 Blocked connection attempts');
      this.setOutput(true, 'Array');
      this.setColour(PROCESS_COLOUR);
      this.setTooltip('List of blocked port connection attempts');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks['health_blocked_connections_count'] = {
    init: function () {
      this.appendDummyInput().appendField('🔒 Blocked connection count');
      this.setOutput(true, 'Number');
      this.setColour(NETWORK_COLOUR);
      this.setTooltip('Number of blocked connection attempts');
      this.setHelpUrl('');
    },
  };
}
