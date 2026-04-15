import QuantityScreen from './QuantityScreen'
import ComponentShowcase from './ComponentShowcase'
import EntityEditorPrototype from './EntityEditorPrototype'

export default function App() {
  const path = window.location.pathname
  if (path === '/showcase') return <ComponentShowcase />
  if (path === '/editor') return <EntityEditorPrototype />
  return <QuantityScreen />
}
