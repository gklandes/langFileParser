import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { FormEvent, useCallback, useRef, useState } from 'react';
import { LangFileObj } from '@/App';
import { Alert } from './ui/alert';
import { Card, CardContent } from './ui/card';

interface AddFileProps { onAdd: (fileObj: LangFileObj) => void }
export default function AddFile({ onAdd }: AddFileProps) {
  const { t } = useTranslation();
  const [openForm, setOpenForm] = useState(false);
  const [error, setError] = useState('');
  const fileInp = useRef<HTMLInputElement | null>(null)

  const addFile = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!fileInp.current) return;
    const target = fileInp.current;
    const files = target.files;
    if (!files || !files.length) return;
    const name = files[0].name;
    const reader = new FileReader();
    reader.addEventListener(
      "loadend",
      () => {
        let data;
        if (reader.error) console.warn(reader.error);
        try {
          data = JSON.parse(reader.result as string);
        } catch (e) {
          console.warn('Parsing error', e);
          setError('Unable to parse the file');
          return;
        }
        onAdd({ name, data, changed: false })
      },
      false,
    );
    reader.readAsText(files[0]);
    console.log(files);
    target.value = '';
  }, [fileInp, onAdd]);

  return <div className="flex flex-col gap-3">
    {!openForm && <Button
      type="button"
      onClick={() => setOpenForm(true)}>
      {t('btn.addFile')}
    </Button>}
    {error && <Alert variant="destructive">
      {error}
    </Alert>}
    {openForm && <Card>
      <CardContent className="p-4">
        <form
          className="flex flex-col gap-3"
          onSubmit={e => addFile(e)}>
          <Label htmlFor="newFile"
          >{t('label.selectFile')}</Label>
          <Input
            id="newFile"
            type="file"
            accept="application/json"
            disabled={!fileInp}
            ref={fileInp} />
          <div className="flex flex-row gap-3 justify-end">
            <Button
              type="submit"
              className="flex-1">{t('btn.import')}</Button>
            <Button
              className="flex-1"
              onClick={() => setOpenForm(false)}
              variant="link">{t('btn.cancel')}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
    }
  </div>

}
