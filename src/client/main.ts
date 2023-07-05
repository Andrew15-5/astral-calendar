// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
const month_dropdown_menu = document.getElementById('month-dropdown-menu')
const month_dropdown_menu_toggle = document.getElementById(
  'month-dropdown-menu-toggle'
)
if (month_dropdown_menu_toggle && month_dropdown_menu) {
  month_dropdown_menu_toggle.onclick = () => {
    if (month_dropdown_menu.ariaExpanded === 'true') {
      month_dropdown_menu.style.display = 'none'
      month_dropdown_menu.ariaExpanded = 'false'
    } else {
      month_dropdown_menu.style.display = 'block'
      month_dropdown_menu.ariaExpanded = 'true'
    }
  }
}
