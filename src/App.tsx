import { ThemeProvider } from '@/components/theme-provider'
import Layout from '@/features/layout/layout'
import { TemplateComputerMain } from './templates/computers/main/TemplateComputerMain'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TemplateComputerMain></TemplateComputerMain>
    </ThemeProvider>
  )
}

export default App
