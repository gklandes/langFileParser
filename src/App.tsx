import { CircleUser, Menu, LanguagesIcon, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTranslation } from 'react-i18next'

export default function App() {
  const { t } = useTranslation();
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
            <h1 className='flex flex-row items-center'>
              <LanguagesIcon className="h-6 w-6 m-2" /><span className="text-2xl font-extrabold leading-tight">{t('app.title')}</span>
            </h1>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <h1 className='flex-1 flex items-center'>
            <LanguagesIcon className="h-6 w-6 m-2 inline" /><span className="text-2xl font-extrabold leading-tight hidden sm:inline">{t('app.title')}</span>
          </h1>
          <form className="ml-auto sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">{t('sr.toggleAppMenu')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>label</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <div className="hidden sm:inline mx-auto w-full max-w-6xl gap-2">
            <Button>{t('btn.addFile')}</Button>
          </div>
          <div className="grid gap-6">
            content here
          </div>
        </div>
      </main>
    </div>
  )
}
