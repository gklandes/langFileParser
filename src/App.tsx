import { useTranslation } from 'react-i18next'
import { Button } from './components/ui/button'
import { ThemeToggle } from './components/theme';

function App() {
  const { t } = useTranslation();

  return <div className='w-full h-[100vh] flex flex-col justify-center items-center'>
    <Button className='mx-auto'>{t('hello')}</Button><br />
    <ThemeToggle />
  </div>;
}

export default App
