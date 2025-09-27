'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CheckIcon, MoonIcon, SunIcon, SunMoon } from 'lucide-react';
import { DropdownMenuCheckboxItem } from '@radix-ui/react-dropdown-menu';

export const ModeToggle = () => {
  const themes = ['system', 'light', 'dark'];
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
        >
          {theme === 'system' ? <SunMoon /> : theme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col space-y-1 divide-y divide-slate-300 dark:divide-slate-700">
          {themes.map((t) => (
            <div
              key={t}
              className="flex space-x-2 items-center cursor-pointer"
              onClick={() => setTheme(t)}
            >
              <CheckIcon size={18} className={theme === t ? '' : 'opacity-0'} />
              <DropdownMenuCheckboxItem checked={theme === t} className="focus:outline-none">
                <span className="capitalize">{t}</span>
              </DropdownMenuCheckboxItem>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
