import EntityEditorPrototype from './EntityEditorPrototype'
import ComponentShowcase from './ComponentShowcase'

export default function App() {
  const isShowcase = window.location.pathname === '/showcase'
  return isShowcase ? <ComponentShowcase /> : <EntityEditorPrototype />
}
