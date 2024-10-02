import { useTranslation } from 'react-i18next'
import { Button } from './components/ui/button'

function App() {
  const { t } = useTranslation();

  return <div className='w-full h-[100vh] flex items-center'>
    <Button className='mx-auto'>{t('hello')}</Button>
  </div>;
}

export default App
