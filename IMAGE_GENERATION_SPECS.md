# Infinibay Image Generation Specifications

This document provides detailed specifications for AI-generated images used throughout the Infinibay VDI platform interface. Each description is optimized for clarity and consistency in AI image generation tools.

## General Style Guidelines

- **Art Style**: Modern 3D isometric illustration with soft shadows
- **Color Palette**: Use Infinibay brand colors (blues, teals, with accent colors for states)
- **Lighting**: Soft, diffused lighting from top-left at 45-degree angle
- **Background**: Transparent or subtle gradient (light to lighter shade)
- **Size**: Generate at 512x512px minimum, scalable vector when possible
- **Detail Level**: Medium detail - recognizable at both thumbnail and full size
- **Perspective**: Isometric 3D view unless otherwise specified

---

## 1. VM States / Dashboard

### 1.1 VM Powered Off
**Filename**: `vm-state-off.svg`
**Description**: A 3D isometric computer server tower in dark gray (#2D3748) with completely dark monitor screen. Display a circular red LED indicator light (solid #EF4444) on the front bottom-right corner of the tower. The tower should have visible ventilation slots on the side. No glow or brightness effects. Matte finish on all surfaces.

### 1.2 VM Powered On
**Filename**: `vm-state-on.svg`
**Description**: A 3D isometric computer server tower in light gray (#E2E8F0) with a bright, illuminated monitor screen showing a subtle blue gradient. Display a circular green LED indicator light (#10B981) with soft glow halo effect on the front bottom-right corner. Add subtle blue accent lighting along the tower edges. The server should appear active with visible light emanating from the ventilation slots.

### 1.3 VM Paused
**Filename**: `vm-state-paused.svg`
**Description**: A 3D isometric computer server tower in medium gray (#718096) with a monitor screen showing frozen/static content. Display a prominent pause icon (two vertical rounded rectangles) floating 20px above the server, colored in amber yellow (#F59E0B) with a subtle drop shadow. The pause icon should be 40% of the server height. Add an amber circular LED indicator on the server front panel.

### 1.4 VM Loading
**Filename**: `vm-state-loading.svg`
**Description**: A 3D isometric computer server tower in light gray with an active monitor screen. Display a circular progress spinner (3/4 complete arc, 8px thick stroke) wrapped around the entire server tower at its vertical center. The spinner should be gradient blue (#3B82F6 to #06B6D4), animated appearance suggested by motion blur on the leading edge. Add a blue pulsing LED indicator on the server front.

### 1.5 Multiple VMs Grid
**Filename**: `vm-state-multiple.svg`
**Description**: A 3D isometric grid layout showing exactly 4 mini server towers arranged in a 2x2 grid pattern with 20px spacing between them. Each server should be 1/3 the size of standard VM icons. Colors: front-left server green (#10B981), front-right server blue (#3B82F6), back-left server amber (#F59E0B), back-right server gray (off). Display each server with its corresponding colored LED indicator. Use shallow depth of field with front servers in sharp focus.

---

## 2. Onboarding / Empty States

### 2.1 No VMs Created
**Filename**: `empty-state-no-vms.svg`
**Description**: A 3D isometric wireframe outline of a server tower in dashed gray lines (#CBD5E0), appearing transparent/ghost-like. Display a large circular plus icon (+) floating 30px above the center of the wireframe server. The plus icon should be solid teal (#14B8A6), 50% of the server height, with a subtle pulsing glow effect. Background contains very faint grid pattern suggesting empty space.

### 2.2 Welcome Wizard
**Filename**: `onboarding-welcome.svg`
**Description**: A 3D isometric scene showing a simplified human hand (skin tone #F4A460, viewed from 45-degree angle) with index finger extended, touching a floating translucent holographic screen. The screen should display a subtle blue gradient (#3B82F6 to transparent) with concentric ripple circles emanating from the touch point. Add small floating UI element icons (gear, server, checkmark) around the screen at 60px distance, semi-transparent. Screen dimensions approximately 200x300px.

### 2.3 Initial Configuration
**Filename**: `onboarding-setup.svg`
**Description**: Three 3D isometric mechanical gears arranged in a triangular formation, actively interlocking with each other. Gears should be different sizes: large (80px diameter) at bottom, medium (60px) at top-right, small (40px) at top-left. Colors: gradient from steel blue (#4682B4) at bottom to light blue (#87CEEB) at top. Display visible gear teeth meshing together, with subtle motion blur suggesting rotation. Add small bright points at connection points indicating energy transfer.

### 2.4 Tutorial Complete
**Filename**: `onboarding-complete.svg`
**Description**: A large 3D checkmark icon (rounded stroke style, 12px thickness) in vibrant green (#10B981) positioned at center. The checkmark should be 150px tall with a subtle depth extrusion (5px). Surround with exactly 12 confetti pieces in various shapes (squares, circles, triangles) colored in teal (#14B8A6), blue (#3B82F6), and yellow (#FBBF24), appearing to float at various distances from the checkmark. Confetti should be subtle, semi-transparent (60% opacity), scattered within a 200px radius.

---

## 3. Firewall / Security

### 3.1 Firewall Active
**Filename**: `firewall-active.svg`
**Description**: A 3D isometric shield shape (medieval kite shield proportions: 120px tall, 90px wide) in gradient blue (#1E3A8A to #3B82F6, top to bottom). Display a stylized flame symbol at the shield center: three upward-pointing flame shapes in bright orange (#F97316) and yellow (#FBBF24) gradient. The flames should be smooth, modern vector style (not realistic), contained within a 50px circle area. Add subtle metallic highlights on shield edges and a soft blue glow around the perimeter.

### 3.2 Blocked Rule
**Filename**: `firewall-blocked.svg`
**Description**: A 3D isometric brick wall (5 bricks wide, 4 bricks tall, each brick 40x20px) in terracotta red (#DC2626) with darker grout lines (#991B1B). Display a large circular prohibition symbol (red circle with diagonal line, ISO 7010 style) overlaid at the center, sized 80% of wall height. The prohibition symbol should be bright red (#EF4444) with white (#FFFFFF) diagonal bar, slightly floating 10px in front of the wall with drop shadow.

### 3.3 Allowed Rule
**Filename**: `firewall-allowed.svg`
**Description**: A 3D isometric open door (120px tall, 80px wide when fully open) shown at 45-degree open angle. Door should be wooden texture in warm brown (#92400E) with visible grain patterns. Display a large green checkmark icon (#10B981, 50px tall) floating in the open doorway area, positioned at vertical center. Add bright light rays (3-4 beams) emanating from behind the door in soft yellow (#FEF3C7), suggesting passage through. Door frame should be darker brown (#78350F).

### 3.4 Blocked Traffic
**Filename**: `firewall-traffic-blocked.svg`
**Description**: A 3D isometric shield (same as 3.1, but solid blue #3B82F6) positioned at the right side. Display a thick 3D arrow (20px shaft width, 40px arrowhead) in dark gray (#4B5563) approaching from the left side, pointing toward the shield. The arrow should appear to be bouncing back with motion lines showing deflection at a 45-degree angle. Add small spark/impact effects (5-6 yellow (#FBBF24) star bursts, 8-pointed) at the collision point between arrow tip and shield surface.

### 3.5 Secure Configuration
**Filename**: `firewall-secure.svg`
**Description**: A 3D isometric closed padlock (80px tall, 50px wide body) in gradient gold (#F59E0B to #D97706, top to bottom) with metallic highlights. The shackle should be thick (12px) and polished steel gray (#6B7280). Display two mechanical gears (25px and 18px diameter) positioned behind the lock body, slightly overlapping it, in the same gold gradient. The gears should appear to be integrated into the lock mechanism. Add a subtle blue glow (#3B82F6, 50% opacity) around the entire composition suggesting active security.

---

## 4. Networking

### 4.1 Network Configured
**Filename**: `network-configured.svg`
**Description**: A 3D isometric network diagram showing 5 nodes arranged in a hub-and-spoke topology. Center node (hub) should be a larger sphere (40px diameter) in bright teal (#14B8A6). Four peripheral nodes (20px diameter spheres) in light blue (#60A5FA) positioned at 90-degree intervals, 80px from center. Connect each peripheral node to the center with glowing gradient lines (4px width, gradient from node color to teal) with animated energy pulses suggested by brighter sections. Add small data packet icons (8px squares) traveling along the connections.

### 4.2 No Connection
**Filename**: `network-disconnected.svg`
**Description**: A 3D isometric Ethernet cable (RJ45 connector style) split into two separate pieces with a 30px gap between them. Left piece should be 80px long, right piece 60px long, both in light gray (#D1D5DB) with blue cable jacket visible. The RJ45 connectors should face each other across the gap, showing exposed gold contacts (#F59E0B). Display a small red X symbol (#EF4444, 20px) floating in the gap between the cable ends. Add frayed wire strands at the break point.

### 4.3 IP Address Assigned
**Filename**: `network-ip-assigned.svg`
**Description**: A 3D isometric identification card (85x54mm credit card proportions, scaled to 150px width) in white (#FFFFFF) with subtle shadow. Display "192.168.1.100" in monospace font (24px, bold) centered on the card in dark blue (#1E40AF). Add a small network icon (connected nodes, 20px) in the top-left corner in teal (#14B8A6). Include a green checkmark badge (#10B981, 25px) positioned at the top-right corner of the card, slightly overlapping the edge. Card should have rounded corners (8px radius).

### 4.4 Bandwidth Meter
**Filename**: `network-bandwidth.svg`
**Description**: A 3D isometric speedometer gauge (120px diameter semi-circle) with a gradient arc from green (#10B981) on the left, through yellow (#FBBF24) in the middle, to red (#EF4444) on the right. Display tick marks at 0%, 25%, 50%, 75%, 100% positions. The needle should be a 3D metallic pointer (80px long, 8px wide) in steel gray (#71717A) pointing to approximately 70% position (in the yellow-orange zone). Add a digital display at the bottom showing "700 Mbps" in LED-style font (18px, green #10B981). Base should be dark gray (#374151).

---

## 5. Storage

### 5.1 Disk Full
**Filename**: `storage-full.svg`
**Description**: A 3D isometric storage cylinder (database drum style: 100px diameter, 80px height) in gradient red (#DC2626 to #991B1B, top to bottom) with horizontal ring segments visible. Display a vertical fill indicator bar (15px wide) on the cylinder's front face showing 100% capacity with red (#EF4444) filling the entire bar. Add "100%" text in white (#FFFFFF, bold, 20px) floating above the cylinder. Include a small warning triangle icon (#FBBF24, 25px) with exclamation mark in the top-right corner.

### 5.2 Storage Available
**Filename**: `storage-available.svg`
**Description**: A 3D isometric storage cylinder (same style as 5.1) in gradient blue (#3B82F6 to #1E40AF, top to bottom). Display a vertical fill indicator bar (15px wide) on the front face showing 45% capacity: bottom 45% filled with blue (#3B82F6), top 55% empty in light gray (#E5E7EB). Add "55% free" text in dark gray (#374151, 18px) floating above. Include a green checkmark icon (#10B981, 30px) positioned at the top-right corner.

### 5.3 Backup / Snapshot
**Filename**: `storage-snapshot.svg`
**Description**: A 3D isometric clock face (100px diameter) in metallic gray (#9CA3AF) showing 10:10 time position. Display a thick circular arrow (12px stroke) wrapping around the clock's perimeter, starting at 12 o'clock and ending at 10 o'clock position with arrowhead, in teal (#14B8A6). The arrow should have a gradient (lighter at start, darker at end). Add small tick marks inside the clock face at quarter positions. Include a small camera shutter icon (20px) at the clock center in blue (#3B82F6).

### 5.4 File Transfer
**Filename**: `storage-transfer.svg`
**Description**: A 3D isometric folder icon (80px wide, 60px tall) in golden yellow (#F59E0B) positioned at the center. Display two curved arrows forming a circular flow: one arrow (blue #3B82F6, 8px thick) with upward trajectory on the left side, another arrow (green #10B981, 8px thick) with downward trajectory on the right side. Both arrows should start/end at the folder edges, creating a continuous circulation effect. Add small data packet icons (squares, 10px) along the arrow paths suggesting data movement. Folder should have slight opening at the top showing documents inside.

---

## 6. Errors / Alerts

### 6.1 Critical Error
**Filename**: `alert-critical.svg`
**Description**: A 3D isometric equilateral triangle (120px per side) in bright red (#EF4444) with black border (4px thick, #000000). Display a large exclamation mark (!) at the center in white (#FFFFFF, bold, 60px height) with drop shadow. The triangle should have depth extrusion (10px) showing red sides. Add a subtle pulsing red glow (#DC2626, 50% opacity, 20px radius) around the perimeter. Triangle should be oriented with one point facing upward.

### 6.2 Warning State
**Filename**: `alert-warning.svg`
**Description**: A 3D isometric traffic light signal (40px wide, 120px tall) in dark gray housing (#374151) with three circular light positions. Only the middle (yellow) light should be illuminated in bright amber (#FBBF24) with strong glow effect (30px radius). Top (red) and bottom (green) lights should be dark/off (#1F2937). Add realistic reflection highlights on the housing and a mounting pole extending downward (15px diameter, 60px length) in the same gray.

### 6.3 Success State
**Filename**: `alert-success.svg`
**Description**: A large 3D checkmark icon (140px tall, 120px wide) in vibrant green (#10B981) with rounded stroke (16px thickness). The checkmark should have significant depth extrusion (8px) creating a bold 3D effect. Add a radiant bright glow emanating from the checkmark in concentric circles (3 layers: #D1FAE5 at 40px, #6EE7B7 at 25px, #10B981 at 10px radius). Include small sparkle effects (4-pointed stars, 12px) at the checkmark's corner and tip in white (#FFFFFF).

### 6.4 Information State
**Filename**: `alert-info.svg`
**Description**: A 3D isometric circle (100px diameter) in gradient blue (#3B82F6 to #1D4ED8, top to bottom) with depth extrusion (6px). Display a lowercase letter "i" at the center in white (#FFFFFF, bold, 60px height) with a circular dot above (15px diameter). The circle should have a subtle blue glow (#60A5FA, 30% opacity, 15px radius). Add a thin white border (2px) around the circle's edge.

---

## 7. Users / Departments

### 7.1 Individual User
**Filename**: `user-individual.svg`
**Description**: A 3D isometric simplified human avatar showing head and shoulders only (80px tall total). Head should be a sphere (40px diameter) in skin tone (#F4A460). Shoulders should be a truncated cone in teal (#14B8A6) suggesting a shirt. Display a small circular badge (25px diameter) at the bottom-right corner of the avatar, overlapping slightly, in blue (#3B82F6) with white star icon (15px). Keep facial features minimal (just two dots for eyes, curved line for smile). Add subtle shading to create dimension.

### 7.2 Department Group
**Filename**: `user-department.svg`
**Description**: Three 3D isometric simplified avatars (same style as 7.1) arranged in a triangular composition. Front avatar (centered, full size 80px tall) in teal shirt (#14B8A6). Back-left avatar (70% scale) in blue shirt (#3B82F6) positioned 40px behind and 30px left. Back-right avatar (70% scale) in purple shirt (#8B5CF6) positioned 40px behind and 30px right. Use depth of field with front avatar in sharp focus. All avatars should have different skin tones for diversity. Stack them so they slightly overlap.

### 7.3 Permissions Key
**Filename**: `user-permissions.svg`
**Description**: A 3D isometric old-fashioned key (120px long total) in gradient gold (#F59E0B to #D97706). Key head should be ornate circular design (35px diameter) with decorative cutouts. Key shaft should be 70px long with 3 distinct teeth at the end. Display a small white rectangular tag (40x20px) attached to the key head with a ring, showing "ADMIN" text in dark gray (#374151, 10px, bold). Add metallic highlights and subtle reflections on the gold surface.

### 7.4 Assignment Action
**Filename**: `user-assignment.svg`
**Description**: A 3D isometric human hand (viewed from 45-degree angle, skin tone #F4A460) extending from the left side, shown from wrist to fingertips (approximately 100px long). The hand should be in "offering" position (palm up, fingers slightly curved). Display a small rectangular credential card (60x40px) hovering 10px above the palm, positioned as if being handed over. The card should be white (#FFFFFF) with a small user icon and "ID: 12345" text. Add motion lines (3-4 curved dashed lines) suggesting the card is being transferred to the right.

---

## 8. Performance / Monitoring

### 8.1 High CPU Usage
**Filename**: `performance-cpu-high.svg`
**Description**: A 3D isometric CPU chip (80x80px square) in dark gray (#374151) with gold contact pins visible on edges. Display "CPU" text embossed on the chip surface in light gray (#D1D5DB, 16px). Position a medical thermometer (70px tall, 15px wide) diagonally across the chip at 45-degree angle. The thermometer should have a glass tube with red mercury (#EF4444) filled to 85% capacity, showing critical temperature. Add heat wave distortion effects (3-4 wavy transparent lines) rising from the top of the thermometer.

### 8.2 Low RAM
**Filename**: `performance-ram-low.svg`
**Description**: A 3D isometric RAM memory module (120px long, 40px tall) in bright green PCB (#10B981) with black memory chips (8 chips, 15x8px each) mounted on top. Display a vertical capacity indicator bar (10px wide) on the left edge showing low memory: bottom 20% filled in amber yellow (#F59E0B), top 80% empty in light gray (#E5E7EB). Add "4GB / 16GB" text floating above the module in dark gray (#374151, 14px). Include gold contact pins visible at the bottom edge.

### 8.3 Performance Graph
**Filename**: `performance-graph.svg`
**Description**: A 3D isometric computer monitor (16:9 aspect ratio, 140px wide) in dark gray frame (#374151) showing an active display. On the screen, display a line graph with three colored lines: blue (#3B82F6), green (#10B981), and amber (#F59E0B), showing varying wave patterns suggesting CPU, RAM, and disk usage. The graph should have visible grid lines (5x5 grid) in light gray (#E5E7EB). Add subtle scan line animation effect (horizontal line moving upward). Monitor should have a small stand base.

### 8.4 System Health
**Filename**: `performance-health.svg`
**Description**: A 3D isometric anatomical heart shape (80px tall, 70px wide) in gradient red (#EF4444 to #DC2626, top to bottom) with visible vessels. Display an ECG/heartbeat line overlaid across the heart in bright green (#10B981, 4px stroke) showing normal sinus rhythm pattern (one tall spike, two smaller waves). The ECG line should have a subtle glow effect. Add small pulse rings (2-3 concentric circles) emanating from the heart in light red (#FCA5A5, 50% opacity) suggesting healthy beating.

---

## 9. Installation / Setup

### 9.1 Downloading ISO
**Filename**: `setup-download.svg`
**Description**: A 3D isometric cloud shape (100px wide, 60px tall) in white (#FFFFFF) with light gray shading (#E5E7EB) on the bottom surfaces. Display a thick downward-pointing arrow (20px shaft width, 40px arrowhead) in bright blue (#3B82F6) descending from the cloud center toward a hard disk drive below. The HDD (80px wide, 20px tall cylinder) should be in dark gray (#374151) with a subtle activity LED in green (#10B981). Add small data packet icons (10px squares in various blues) along the arrow path suggesting download progress. Include a progress percentage "67%" text near the arrow in blue.

### 9.2 Installing OS
**Filename**: `setup-install.svg`
**Description**: A 3D isometric optical disc (CD/DVD, 100px diameter, 3px thickness) in reflective silver (#E5E7EB) with rainbow reflection spectrum visible on the surface. Display an optical drive tray (120px wide, 30px tall) in dark gray (#374151) positioned below the disc, shown in partial open position (60% extended). The disc should appear to be lowering into the drive with motion lines (3-4 curved dashed lines) indicating downward movement. Add a small green activity LED (#10B981) on the drive front panel. Show subtle laser light beam (red #EF4444, thin line) from drive reading the disc.

### 9.3 Requirements Check
**Filename**: `setup-requirements.svg`
**Description**: A 3D isometric clipboard (90px wide, 120px tall) with dark blue backing (#1E40AF) and white paper (#FFFFFF) showing a checklist. Display exactly 5 checkbox lines: first 3 with green checkmarks (#10B981, 20px), 4th with an amber warning icon (#F59E0B), 5th empty (unchecked). Each checkbox should be 18x18px with 2px border. Add horizontal lines next to each checkbox suggesting text (60px long, gray #9CA3AF). Include a clipboard clip at the top in metallic silver (#71717A). The paper should have subtle shadow on the backing.

### 9.4 Wizard Steps
**Filename**: `setup-wizard-steps.svg`
**Description**: Three 3D isometric numbers (1, 2, 3) arranged along a winding path, showing progression. Number "1" (50px tall) in green (#10B981) at lower-left position with green checkmark badge. Number "2" (50px tall) in blue (#3B82F6) at center-top position with pulsing glow (current step). Number "3" (50px tall) in light gray (#D1D5DB) at lower-right position (upcoming). Connect the numbers with a curved path line (6px thick, dashed in gray #9CA3AF) showing the route. Add small directional arrow indicators along the path. Numbers should have depth extrusion (5px) and be bold sans-serif font.

---

## 10. Common Actions

### 10.1 Restart Action
**Filename**: `action-restart.svg`
**Description**: A 3D circular arrow (12px thick stroke) in bright blue (#3B82F6) forming a complete 270-degree arc (clockwise direction) with a prominent arrowhead at the end. The circle should be 100px in diameter with depth extrusion (8px) creating a 3D ribbon effect. Add a small power symbol (circle with vertical line, 25px) at the center of the circular arrow in dark blue (#1E40AF). Include motion blur effect on the trailing edge of the arrow suggesting rotation. The arrow should have gradient shading (lighter on top surface, darker on side surface).

### 10.2 Delete Action
**Filename**: `action-delete.svg`
**Description**: A 3D isometric waste bin (cylindrical trash can, 70px diameter, 90px tall) in dark gray (#374151) with vertical ribbed texture. Display a removable lid (80px diameter) in lighter gray (#6B7280) shown in tilted open position (45-degree angle), hinged on one side. The bin opening should be visible showing dark interior (#1F2937). Add a universal recycling symbol (three curved arrows forming triangle, 35px) embossed on the bin's front face in light gray (#D1D5DB). Position crumpled paper balls (2-3 items, white #FFFFFF, 15px each) visible inside the bin.

### 10.3 Edit Action
**Filename**: `action-edit.svg`
**Description**: A 3D isometric pencil (120px long, 15px diameter) in classic yellow wood (#FBBF24) with pink eraser top (#EC4899, 20px) and metallic ferrule (#71717A, 8px band). The pencil should be angled at 45 degrees, tip pointing toward lower-right. Display a white document sheet (80x100px, #FFFFFF) positioned flat beneath the pencil tip, showing 3-4 horizontal text lines in gray (#9CA3AF). Add a blue ink trail (#3B82F6, 3px line) being drawn from the pencil tip across the document. Include a subtle document shadow and realistic pencil wood grain texture.

### 10.4 Clone Action
**Filename**: `action-clone.svg`
**Description**: Two identical 3D isometric server towers (each 60px wide, 90px tall) positioned side-by-side with 40px gap between them. Left server in solid blue (#3B82F6), right server in lighter blue (#60A5FA) suggesting it's the copy. Display bi-directional arrows between the servers: one thick arrow (12px wide) pointing right in blue, one pointing left in light blue, positioned at the vertical center. Add a small "2x" badge (#10B981 circle, 30px diameter) with white text floating above the right server. Both servers should have identical details (LED indicators, ventilation) showing they're clones.

### 10.5 Export Action
**Filename**: `action-export.svg`
**Description**: A 3D isometric cardboard box (80x80x60px, LxWxH) in brown (#92400E) with visible corrugated texture on sides. Display the box lid partially open (top flaps raised 45 degrees outward) revealing interior. Show a thick upward-pointing arrow (20px wide shaft, 40px arrowhead) in bright blue (#3B82F6) emerging from inside the box, extending 50px above the rim. Add small file/document icons (3-4 items, 15px each) floating along the arrow path suggesting data export. Include packing tape strips on the box sides in tan (#D97706).

---

## 11. Empty States / No Results

### 11.1 No Search Results
**Filename**: `empty-search.svg`
**Description**: A 3D isometric magnifying glass (handle 60px long, lens 70px diameter) in dark gray handle (#374151) with transparent glass lens showing blue tint (#3B82F6, 30% opacity). Display a large question mark symbol (?) inside the lens in amber yellow (#F59E0B, 45px height, bold). The magnifying glass should be angled at 45 degrees, handle pointing lower-left. Add subtle reflection highlights on the lens surface and a small shadow beneath. Include 2-3 small floating dust particles near the lens in light gray (#D1D5DB).

### 11.2 No Notifications
**Filename**: `empty-notifications.svg`
**Description**: A 3D isometric notification bell (80px tall, 60px wide at base) in light gray (#D1D5DB) with metallic shading. Display a diagonal prohibition line (slash) in red (#EF4444, 8px thick) overlaid across the bell from upper-right to lower-left. The bell should have a small circular clapper visible at the bottom in darker gray (#6B7280). Add a mounting bracket at the top of the bell. The prohibition line should be slightly raised (5px in front of the bell) with drop shadow. Keep the overall tone indicating "no notifications available" rather than "muted."

### 11.3 No Recent Activity
**Filename**: `empty-activity.svg`
**Description**: A 3D isometric hourglass (60px wide, 100px tall) with metallic end caps in gold (#F59E0B) and transparent glass bulbs. The hourglass should be completely empty - no sand in either chamber - showing hollow transparent glass in light blue tint (#E0F2FE, 20% opacity). Position the hourglass upright (vertical). Add subtle reflection highlights on the glass surfaces and detailed texture on the gold caps. Include small mounting feet at the base. The empty state should clearly communicate "no activity" rather than "time running out."

### 11.4 No Blocked Connections
**Filename**: `empty-blocked.svg`
**Description**: A 3D isometric shield (same style as 3.1, 120px tall, 90px wide) in gradient green (#10B981 to #059669, top to bottom) with metallic highlights. Display a large checkmark symbol (60px tall, 12px stroke) at the shield center in bright white (#FFFFFF) with subtle glow effect. Add small sparkle effects (4-pointed stars, 10px) at the top corners of the shield in light green (#D1FAE5). The overall composition should communicate security and safety, indicating no threats detected.

---

## 12. Resources / ISO Library

### 12.1 Windows ISO
**Filename**: `iso-windows.svg`
**Description**: A 3D isometric optical disc (CD/DVD, 100px diameter, 3px thickness) viewed at 30-degree angle. The disc surface should display the Windows logo (four-pane window symbol, 50x50px) at the center in gradient blue (#0078D4 to #00BCF2, Microsoft brand colors). The disc should have a reflective silver-white surface (#E5E7EB) with rainbow spectrum reflection arc visible on one edge. Add a small spindle hole (15px diameter) at the absolute center. Include subtle circular data tracks pattern radiating from center. Show depth on the disc edge.

### 12.2 Linux ISO
**Filename**: `iso-linux.svg`
**Description**: A 3D isometric optical disc (CD/DVD, 100px diameter, 3px thickness) viewed at 30-degree angle. The disc surface should display a stylized Tux penguin (Linux mascot, 60px tall) at the center - black body (#000000), white belly (#FFFFFF), yellow beak and feet (#FBBF24). The disc should have a reflective silver-white surface (#E5E7EB) with rainbow spectrum reflection. Add a small spindle hole (15px diameter) at the center. Include subtle circular data tracks pattern. The penguin should be recognizable but simplified for clarity.

### 12.3 Saved Template
**Filename**: `template-saved.svg`
**Description**: A 3D isometric document sheet (90px wide, 110px tall) in white (#FFFFFF) with slight curl at the top-right corner. Display 5 horizontal text lines (60px long, gray #9CA3AF, 3px thick) in the upper portion of the document suggesting content. Position a large golden star icon (45px, 5-pointed) at the bottom-right corner of the document, overlapping slightly. The star should be gradient gold (#F59E0B to #D97706) with shine highlights. Add a subtle document shadow and blue border accent (2px, #3B82F6) on the left edge suggesting organization.

### 12.4 Shared Resource
**Filename**: `resource-shared.svg`
**Description**: A 3D isometric folder icon (100px wide, 75px tall) in bright yellow (#FBBF24) shown slightly open (top flap raised 30 degrees) revealing blue interior (#3B82F6). Display three simplified user avatar silhouettes (same style as 7.1, 30px tall each) connected to the folder: one avatar positioned at top-left connected by a line (3px, blue #3B82F6), one at top-right, one at bottom-center. The connecting lines should form a network hub pattern with the folder at the center. Add small circular nodes (8px diameter, blue) at each connection point. The folder should have a small sharing icon (overlapping circles, 20px) badge at the corner.

---

## Usage Notes

### File Naming Convention
- Use descriptive kebab-case names
- Include category prefix (vm-state-, empty-, firewall-, etc.)
- Preferred format: SVG (scalable), fallback: PNG at 512x512px minimum

### Color Consistency
All images should use colors from the Infinibay design system:
- **Primary Blue**: #3B82F6
- **Success Green**: #10B981
- **Warning Amber**: #F59E0B
- **Error Red**: #EF4444
- **Neutral Gray**: #6B7280
- **Teal Accent**: #14B8A6

### Accessibility
- Ensure sufficient contrast ratios (WCAG AA minimum)
- Don't rely solely on color to convey meaning
- Include text labels where appropriate
- Test at both small (32px) and large (256px) sizes

### Integration
Images should be placed in: `frontend/public/images/illustrations/`

Reference in components using Next.js Image component:
```jsx
import Image from 'next/image';

<Image
  src="/images/illustrations/vm-state-on.svg"
  alt="Virtual machine running state"
  width={128}
  height={128}
/>
```

---

## Revision History
- **v1.0** (2025-10-08): Initial specification document created
