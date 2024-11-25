import {
  Menu,
  LanguagesIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { useLocalStorage } from './lib/use-local-storage'
import { toast } from 'sonner'
import { parseLangFiles, LangFileObj, FormData } from './lib/parseLangFile'
import { Input } from './components/ui/input'
import { ThemeToggle } from './components/theme'
import FileList from './components/FileList'
import FileAddForm from './components/FileAddForm'

export default function App() {
  const { t } = useTranslation();
  const [langFiles, setLangFiles] = useLocalStorage<LangFileObj[]>('langFiles', []);
  const [formData, setFormData] = useLocalStorage<FormData | null>('formData', null);
  const [sourceFile, setSourceFile] = useLocalStorage<string | null>('sourceFile', null);
  const [fileSelected, setSelectFile] = useLocalStorage<string | null>('fileSelected', null);
  const { allKeys, fileComparisons, flattenedFiles } = parseLangFiles(langFiles);
  console.log({ allKeys, fileComparisons, flattenedFiles });


  const addFile = useCallback((file: LangFileObj) => {
    const match = langFiles.find(f => f.name === file.name);
    if (sourceFile) setSourceFile(file.name);
    if (!fileSelected) setSelectFile(file.name);
    if (match) {
      console.warn('duplicate file added', { langFiles, match });
      toast(t('msg.dupFile'));
    } else {
      setLangFiles([...langFiles, file]);
    }
  }, [langFiles, sourceFile, setSourceFile, fileSelected, setSelectFile, t, setLangFiles]);

  const promoteFile = useCallback((file: LangFileObj) => {
    const otherFiles = langFiles.filter(item => item.name !== file.name);
    setLangFiles([file, ...otherFiles]);
    setSourceFile(file.name);
  }, [langFiles, setLangFiles, setSourceFile])

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
    const newFiles = langFiles.filter(item => item.name !== file.name)
    setLangFiles(newFiles)
    if (file.name === fileSelected) setSelectFile(newFiles.length ? langFiles[0].name : null);
  }, [langFiles, setLangFiles, fileSelected, setSelectFile])

  const handleFormChange = (key: string, value: string) => {
    setFormData({ ...formData, ...{ [key]: value } })
  }

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
            <FileAddForm onAdd={addFile} />
            <FileList
              langFiles={langFiles}
              fileComparisons={fileComparisons}
              onPromote={promoteFile}
              onDownload={downloadFile}
              onRemove={removeFile}/>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <h1 className='flex-1 flex items-center'>
            <LanguagesIcon className="h-6 w-6 m-2 inline" /><span className="text-2xl font-extrabold leading-tight hidden sm:inline">{t('app.title')}</span>
          </h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <div className="hidden sm:inline mx-auto w-full max-w-6xl gap-2">
            <FileAddForm onAdd={addFile} />
            <FileList
              langFiles={langFiles}
              fileComparisons={fileComparisons}
              onPromote={promoteFile}
              onDownload={downloadFile}
              onRemove={removeFile} />
          </div>
          <div className="grid gap-6">
            {!langFiles.length &&
              <Card>
                <CardHeader>
                  <CardTitle>{t('app.getStarted')}</CardTitle>
                </CardHeader>
                <CardContent><p>{t('app.getStartedMsg')}</p></CardContent>
              </Card>
            }
            {langFiles.length &&
              <Card>
                <CardHeader>
                  <CardTitle>
                    <span>{t('app.translations')}</span>
                  </CardTitle>
                  <CardDescription>
                    {t('app.sourceFile')}: {sourceFile}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <table className="w-full"><tbody>
                  {allKeys.map(key => <tr key={key}>
                    <td className="p-2 border-b">
                      <span className='text-sm opacity-40 italic'>{key.split('.').slice(0, -1).join('.')}.</span>
                      <span className='text-sm italic'>{key.split('.').slice(-1)}</span><br />

                    </td>
                    <td className="p-2 border-b">
                      <Input
                        name={`fc_${key}`}
                        value={formData ? formData[key] : '' }
                        onChange={e => {
                          e.preventDefault();
                          handleFormChange(key, e.target.value);
                        }}
                      />
                    </td>
                  </tr>)}
                  </tbody></table>
                </CardContent>
                {/* <CardFooter className="border-t px-6 py-4">
                    <Button>{t('btn.save')}</Button>
                  </CardFooter> */}
              </Card>
            }
          </div>
        </div>
      </main>
    </div>
  )
}
