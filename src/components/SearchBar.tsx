import React, { useState, useCallback, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Search, User, Briefcase, Phone, Mail, X } from 'lucide-react';

interface SearchResult {
  roles: Array<{
    id: number;
    title: string;
    description: string;
    department_name: string;
    organization: string;
    is_leadership: boolean;
  }>;
  personnel: Array<{
    id: number;
    name: string;
    role_title: string;
    department_name: string;
    organization: string;
    contact: string;
    email: string;
    is_elected: boolean;
  }>;
  total: number;
}

interface SearchBarProps {
  onSearch?: (results: SearchResult) => void;
  apiEndpoint?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  apiEndpoint = '/api/search' 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults(null);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${apiEndpoint}?query=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        setResults(data);
        setIsOpen(true);
        onSearch?.(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults({ roles: [], personnel: [], total: 0 });
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [apiEndpoint, onSearch]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    setResults(null);
    setIsOpen(false);
  };

  const highlightMatch = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="search-highlight">{part}</span>
      ) : part
    );
  };

  const getOrganizationBadge = (org: string) => {
    const variants: Record<string, any> = {
      ULB: 'info',
      MCG: 'success',
      GMDA: 'destructive',
      WARD: 'secondary'
    };
    return <Badge variant={variants[org] || 'default'}>{org}</Badge>;
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search roles, personnel, departments..."
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-10"
          aria-label="Search organizational structure"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              Search Results
              {isLoading ? (
                <div className="loading-spinner w-4 h-4"></div>
              ) : (
                results && <Badge variant="outline">{results.total} found</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">
                Searching...
              </div>
            ) : results && results.total === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No results found for "{query}"
              </div>
            ) : results && (
              <div className="space-y-4">
                {/* Personnel Results */}
                {results.personnel.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Personnel ({results.personnel.length})
                    </h4>
                    <div className="space-y-2">
                      {results.personnel.map(person => (
                        <div 
                          key={person.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium">
                                {highlightMatch(person.name, query)}
                                {person.is_elected && (
                                  <Badge variant="warning" className="ml-2 text-xs">
                                    Elected
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                {highlightMatch(person.role_title, query)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {person.department_name}
                              </div>
                              {(person.contact || person.email) && (
                                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                  {person.contact && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {person.contact}
                                    </span>
                                  )}
                                  {person.email && (
                                    <span className="flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {person.email}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            {getOrganizationBadge(person.organization)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Role Results */}
                {results.roles.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Roles ({results.roles.length})
                    </h4>
                    <div className="space-y-2">
                      {results.roles.map(role => (
                        <div 
                          key={role.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium">
                                {highlightMatch(role.title, query)}
                                {role.is_leadership && (
                                  <Badge variant="info" className="ml-2 text-xs">
                                    Leadership
                                  </Badge>
                                )}
                              </div>
                              {role.description && (
                                <div className="text-sm text-gray-600 mt-1">
                                  {highlightMatch(role.description, query)}
                                </div>
                              )}
                              <div className="text-xs text-gray-500 mt-1">
                                {role.department_name}
                              </div>
                            </div>
                            {getOrganizationBadge(role.organization)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default SearchBar;
