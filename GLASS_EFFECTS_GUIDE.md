# Glass Effects Decision Guide

This guide provides clear, contextual decisions for when and how to use glass effects in Infinibay's UI. For technical details about the glass system, see `DESIGN_GUIDELINES.md`.

## Quick Reference Table

| Contexto | Glass Effect | Elevation | Cuando Usar |
|----------|--------------|-----------|-------------|
| Headers sticky | `acrylic` | 4-5 | Headers que permanecen visibles al scroll |
| Sidebars/Navigation | `mica` | 2-3 | Navegacion con texto, menus laterales |
| Contenido principal | `glass-medium` | 2-3 | Areas de contenido mixto (texto + imagenes) |
| Cards de informacion | `glass-subtle` | 1-2 | Cards con texto que necesitan legibilidad |
| Modales/Dialogos | `glass-strong` | 5 | Contenido critico que requiere foco |
| Formularios | `glass-minimal` | 1-2 | Formularios con inputs y texto critico |
| Overlays de fondo | `glass-overlay` | 0 | Fondos de modales (sin blur propio) |

## Decision Tree

```
¿Que tipo de componente?
│
├── ¿Es navegacion?
│   ├── Sidebar → mica + elevation-2
│   └── Header sticky → acrylic + elevation-4
│
├── ¿Es contenido?
│   ├── Texto critico → glass-minimal + elevation-1
│   ├── Contenido mixto → glass-medium + elevation-3
│   └── Cards info → glass-subtle + elevation-1
│
└── ¿Es modal/dialogo?
    ├── Confirmacion → glass-strong + elevation-5
    └── Overlay fondo → glass-overlay
```

## Ejemplos por Contexto

### Paginas de Departamentos

- **Container principal**: `glass-medium` + `elevation-3` + `radius-lg`
- **Subtitle section**: `glass-subtle` + `elevation-1` + `radius-md`
- **Tab controls**: `glass-subtle` + `elevation-1` + `radius-md`

### Paginas de VM Detail

- **Container principal**: `glass-medium` + `elevation-3`
- **Tab content**: `glass-medium` + `elevation-3`

### Dialogos

- **AlertDialog destructivo**: `glass-strong` + `elevation-5`
- **Dialog normal**: `glass-medium` + `elevation-4`

### Cards

- **DepartmentCard**: `elevation-1` (sin glass, usa bg-card)
- **UserPc card**: `glass-subtle` + `elevation-2`

## Uso de getGlassClasses()

### Patron Recomendado

```jsx
import { getGlassClasses } from '@/utils/glass-effects';
import { cn } from '@/lib/utils';

<div className={cn(
  getGlassClasses({
    glass: 'medium',
    elevation: 3,
    radius: 'lg'
  }),
  "size-container size-padding"
)}>
```

### Ventajas de usar getGlassClasses()

- **Fallbacks automaticos** para navegadores sin backdrop-filter
- **Soporte para prefers-reduced-transparency** respetando preferencias del usuario
- **Clases de transicion incluidas** para animaciones suaves
- **Consistencia en toda la app** usando una sola fuente de verdad

### Cuando NO usar getGlassClasses()

- Componentes base que ya lo implementan internamente (Dialog, GlassCard, Header)
- Cards solidas que usan `bg-card` sin efectos glass

## Mapeo de Componentes Actuales

| Componente | Ubicacion | Glass Actual | Glass Recomendado | Razon |
|------------|-----------|--------------|-------------------|-------|
| DepartmentCard | departments/components | `elevation="1"` (sin glass) | Mantener sin glass | Cards usan bg-card solido |
| TabControls | departments/[name]/components | `glass-subtle` | Mantener | Correcto para controles |
| Content container (dept page) | departments/page.js | `glass-medium` | `getGlassClasses({ glass: 'medium', elevation: 3 })` | Usar utility para fallbacks |
| Content container (dept detail) | departments/[name]/page.js | `getGlassClasses()` | Mantener | Ya correcto |
| VM detail container | departments/[name]/vm/[id]/page.js | `glass-medium` | `getGlassClasses({ glass: 'medium', elevation: 3 })` | Usar utility |
| AlertDialog | Varios | `glass="strong"` | Mantener | Correcto para modales |

## Mapeo de Glass Effects

| Contexto | Clase Directa | getGlassClasses() | Elevation |
|----------|---------------|-------------------|-----------|
| Header sticky | `acrylic` | `{ glass: 'none', effect: 'acrylic', elevation: 4 }` | 4-5 |
| Sidebar | `mica` | `{ glass: 'none', effect: 'mica', elevation: 2 }` | 2-3 |
| Contenido principal | `glass-medium` | `{ glass: 'medium', elevation: 3 }` | 2-3 |
| Cards info | `glass-subtle` | `{ glass: 'subtle', elevation: 1 }` | 1-2 |
| Modales | `glass-strong` | `{ glass: 'strong', elevation: 5 }` | 5 |
| Formularios | `glass-minimal` | `{ glass: 'minimal', elevation: 1 }` | 1-2 |

## Testing Checklist

### Despues de Cambios de Spacing

- [ ] Verificar en todos los tamanos (sm, md, lg, xl)
- [ ] Probar en diferentes resoluciones (movil, tablet, desktop)
- [ ] Verificar que no haya overflow o elementos cortados
- [ ] Comprobar spacing consistente entre componentes similares
- [ ] Validar que los margenes/paddings escalen correctamente

### Despues de Cambios de Glass Effects

- [ ] Probar con wallpaper dinamico activado
- [ ] Verificar contraste de texto en tema claro y oscuro
- [ ] Comprobar legibilidad sobre fondos claros y oscuros
- [ ] Verificar fallbacks en navegadores sin backdrop-filter
- [ ] Probar con `prefers-reduced-transparency: reduce`
- [ ] Validar que elevation shadows sean visibles
- [ ] Comprobar que no haya glass effects apilados

### Accesibilidad

- [ ] Verificar contraste WCAG AA (4.5:1 para texto normal)
- [ ] Probar navegacion por teclado
- [ ] Verificar que tooltips sean accesibles
- [ ] Comprobar que estados de focus sean visibles
- [ ] Validar que screen readers lean correctamente

## CSS Custom Properties Disponibles

```css
/* Spacing */
--size-padding
--size-gap
--size-margin-xs
--size-margin-sm

/* Typography */
--size-text
--size-heading
--size-small

/* Components */
--size-card-padding
--size-input-height
--size-icon
```

## Mapeo de Spacing Hardcodeado → Size System

| Hardcoded | Size System | Uso |
|-----------|-------------|-----|
| `p-4`, `p-6` | `size-padding` | Padding general |
| `px-4 py-2` | `size-padding` o custom | Padding de tabs/botones |
| `gap-4` | `size-gap` | Gaps en flex/grid |
| `mb-4`, `mt-4` | `size-margin-sm` | Margenes medianos |
| `mb-2`, `mt-2` | `size-margin-xs` | Margenes pequenos |
| `space-y-4` | `size-gap` (con flex-col) | Spacing vertical |
| `pt-6 pb-0` | `size-card-padding pb-0` | Padding de cards |
| `py-3` | `size-card-footer` | Footer de cards |
