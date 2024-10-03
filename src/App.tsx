import {
  Menu,
  LanguagesIcon,
  Trash2Icon,
  DownloadIcon,
  ArrowBigUpDashIcon,
  StarIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTranslation } from 'react-i18next'
import AddFile from './components/AddFile'
import { useCallback } from 'react'
import { useLocalStorage } from './lib/use-local-storage'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion'
import { toast } from 'sonner'

type LangFileTranslation = { [key: string]: string | LangFileTranslation };
export interface LangFileObj {
  name: string;
  data: LangFileTranslation;
  changed: boolean;
}

export default function App() {
  const { t } = useTranslation();
  const [langFiles, setLangFiles] = useLocalStorage<LangFileObj[]>('langFiles', []);

  const handleAddFile = useCallback((fileObj: LangFileObj) => {
    const match = langFiles.find(file => file.name === fileObj.name);
    if (match) {
      console.warn('duplicate file added', { langFiles, match });
      toast(t('msg.dupFile'));

    } else {
      setLangFiles([...langFiles, fileObj]);
    }
  }, [setLangFiles, langFiles, t]);

  const promoteFile = useCallback((file: LangFileObj) => {
    const otherFiles = langFiles.filter(item => item.name !== file.name);
    setLangFiles([file, ...otherFiles])
  }, [setLangFiles, langFiles])

  const downloadFile = (file: LangFileObj) => {
    const blob = new Blob([JSON.stringify(file.data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const removeFile = useCallback((file: LangFileObj) => {
    setLangFiles(langFiles.filter(item => item.name !== file.name))
  }, [setLangFiles, langFiles])

  const FileList = () => <>{!!langFiles.length &&
    <Accordion
      type="single"
      collapsible>
      {langFiles.map((file, i) => (
        <AccordionItem key={file.name} value={file.name}>
          <AccordionTrigger>
            <h3 className='px-2 text-lg font-semibold'>{file.name}</h3>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="border-l-4 p-2">
              <li>
                <Button
                  type="button"
                  disabled={i === 0}
                  variant="ghost"
                  className="w-full px-1 flex flex-row gap-2"
                  onClick={() => promoteFile(file)}>
                  <span className='text-start flex-1'>
                    {i !== 0 ? t('btn.setBase') : t('btn.isBase')}
                  </span>
                  {i !== 0 ? <ArrowBigUpDashIcon className="h-4 w-4" /> : <StarIcon className="h-4 w-4" />}
                </Button>
              </li>
              <li>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full px-1 flex flex-row gap-2"
                  onClick={() => downloadFile(file)}>
                  <span className='text-start flex-1'>Download</span>
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </li>
              <li className='text-destructive'>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full px-1 flex flex-row gap-2"
                  onClick={() => removeFile(file)}>
                  <span className='text-start flex-1'>Remove</span>
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  }</>

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{t('sr.toggleFileMenu')}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <h1 className='flex flex-row items-center mb-3'>
              <LanguagesIcon className="h-6 w-6 m-2" /><span className="text-2xl font-extrabold leading-tight">{t('app.title')}</span>
            </h1>
            <AddFile onAdd={handleAddFile} />
            <FileList />
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <h1 className='flex-1 flex items-center'>
            <LanguagesIcon className="h-6 w-6 m-2 inline" /><span className="text-2xl font-extrabold leading-tight hidden sm:inline">{t('app.title')}</span>
          </h1>
        </div>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <div className="hidden sm:inline mx-auto w-full max-w-6xl gap-2">
            <AddFile onAdd={handleAddFile} />
            <FileList />
          </div>
          <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Title</CardTitle>
                <CardDescription>
                  Description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <Input placeholder="Input" />
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>{t('btn.save')}</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
