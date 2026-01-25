import type { RootState } from '../../../app/store'

export const selectTheme = (state: RootState) => state.ui.theme
