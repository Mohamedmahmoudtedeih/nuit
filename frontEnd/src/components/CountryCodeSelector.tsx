import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { countryCodes, CountryCode } from '@/data/countryCodes';
import { ChevronDown, Search } from 'lucide-react';

interface CountryCodeSelectorProps {
  value: CountryCode;
  onChange: (country: CountryCode) => void;
}

const CountryCodeSelector = ({ value, onChange }: CountryCodeSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-[150px] justify-between gap-2 h-12 px-3 border-input"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">{value.flag}</span>
            <span className="text-sm font-medium">{value.dialCode}</span>
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-2">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un pays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country);
                  setOpen(false);
                  setSearchQuery('');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors ${
                  value.code === country.code ? 'bg-muted' : ''
                }`}
              >
                <span className="text-lg">{country.flag}</span>
                <span className="flex-1 text-left">{country.name}</span>
                <span className="text-muted-foreground">{country.dialCode}</span>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CountryCodeSelector;

