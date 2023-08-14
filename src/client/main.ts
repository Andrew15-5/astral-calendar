// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
type SelectorName = 'month' | 'quarter' | 'year'
const selectors: SelectorName[] = ['month', 'quarter', 'year']

for (const selector of selectors) {
  const dropdown_menu = document.getElementById(`${selector}-dropdown-menu`)
  const dropdown_menu_toggle = document.getElementById(
    `${selector}-dropdown-menu-toggle`
  )
  if (!dropdown_menu || !dropdown_menu_toggle) continue
  dropdown_menu_toggle.addEventListener('click', () => {
    if (dropdown_menu.ariaExpanded === 'true') {
      dropdown_menu.style.display = 'none'
      dropdown_menu.ariaExpanded = 'false'
    } else {
      dropdown_menu.style.display = 'block'
      dropdown_menu.ariaExpanded = 'true'
    }
  })
  document.body.addEventListener(
    'click',
    (event: FocusEvent) => {
      // To make dropdown menu's items clickable we have to return
      if (event.target === dropdown_menu) return
      // To make dropdown menu toggle's logic work we have to return
      if (event.composedPath().includes(dropdown_menu_toggle)) return
      dropdown_menu.style.display = 'none'
      dropdown_menu.ariaExpanded = 'false'
    },
    { capture: true }
  )
}
