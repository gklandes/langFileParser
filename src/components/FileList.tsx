import { t } from 'i18next';
import { ArrowBigUpDashIcon, StarIcon, DownloadIcon, Trash2Icon } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { LangFileObj } from '@/lib/parseLangFile';

interface FileListProps {
  langFiles: LangFileObj[];
  fileComparisons: Record<string, string[]> | null;
  onPromote: (file: LangFileObj) => void;
  onDownload: (file: LangFileObj) => void;
  onRemove: (file: LangFileObj) => void;
};
const FileList = ({ langFiles, fileComparisons, onPromote, onDownload, onRemove }: FileListProps) => {
  return <>
    {!!langFiles.length && <Accordion
      type="single"
      collapsible>
      {langFiles.map((file, i) => (
        <AccordionItem key={file.name} value={file.name}>
          <AccordionTrigger>
            <h3 className='px-2 text-lg font-semibold'>
              {file.name}
              {fileComparisons && fileComparisons[file.name].length > 1 && <>
                &nbsp;<div className='inline-block text-xs text-destructive p-1'>{fileComparisons[file.name].length} {t('app.missing')}</div>
              </>}
            </h3>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="border-l-4 p-2">
              <li>
                <Button
                  type="button"
                  disabled={i === 0}
                  variant="ghost"
                  className="w-full px-1 flex flex-row gap-2"
                  onClick={() => onPromote(file)}>
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
                  onClick={() => onDownload(file)}>
                  <span className='text-start flex-1'>Download</span>
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </li>
              <li className='text-destructive'>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full px-1 flex flex-row gap-2"
                  onClick={() => onRemove(file)}>
                  <span className='text-start flex-1'>Remove</span>
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>}
  </>
}
export default FileList;