We need the base chrome compoenets that frome every editor screen - the top navbar and the left siderbar shell. these will be reused and extended in every chapter that follows.

### Editor Navbar

create 'componenets/editor/editor-navbar.tsx'.

Requirements:

-fixed-height top navbar
-left,center, and right sections
-left section contains siderbar toggle button
-use 'PanelLeftOpen' / 'PnaelLeftClose' icons based on the sidebar state.
-right section stays empty for now
-dark background with subtle bottom border

### Project Siderbar

-Sidebar should float above the editor canvas 
-opening it should not push page content
-slides in from the left
-accepts 'isOpen' and 'onClose' props
-header with 'Projects' title + close button
-shadcn 'Tabs':
 -My Projects
 -Shared
-both tabs show empty placeholders state
-full-width 'New Project' button at the buttom with 'Plus' icon

### Dialog pattern

use the existing color theme from 'global.css' for dialog styling.

support:

-title
-desciption
-footer actions

do not build actual dialogs yet.

### check when done

- new components compile without typescript errors
- no lint errors
- dialog pattern is ready for future use