export type FormData = { [key: string]: string };

export type LangFileTranslation = { [key: string]: string | LangFileTranslation };

export interface LangFileObj {
  name: string;
  data: LangFileTranslation;
  form: FormData;
}

interface FlattenedPair {
  key: string;
  value: string;
}

export interface FullComparisonResult {
  allKeys: string[];
  fileComparisons: Record<string, string[]>;
  flattenedFiles: Record<string, FlattenedPair[]>;
}

function flattenAndSortTranslations(
  obj: LangFileTranslation,
  prefix: string = ''
): FlattenedPair[] {
  return Object.entries(obj).reduce<FlattenedPair[]>((acc, [key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null) {
      // Recursively flatten nested objects
      return [...acc, ...flattenAndSortTranslations(value, newKey)];
    }

    // Add leaf nodes to accumulator
    return [...acc, { key: newKey, value: value as string }];
  }, []).sort((a, b) => a.key.localeCompare(b.key));
}

export function parseLangFiles(files: LangFileObj[]): FullComparisonResult {
  if (!files.length) return { allKeys: [], fileComparisons: {}, flattenedFiles: {} };
  // First, flatten all files
  const flattenedFiles = files.reduce((obj, file) => {
    obj[file.name] = flattenAndSortTranslations(file.data);
    return obj;
  }, {} as Record<string, FlattenedPair[]>);

  // Collect all unique keys across all files
  const unsortedAllKeys = new Set<string>();
  Object.values(flattenedFiles).forEach(translations => {
    translations.forEach(item => {
      unsortedAllKeys.add(item.key);
    });
  });

  // Sort all keys alphabetically
  const allKeys = Array.from(unsortedAllKeys).sort();

  // Compare each file against all keys
  const fileComparisons = Object.keys(flattenedFiles).reduce((obj, fileName) => {
    const translations = flattenedFiles[fileName];
    const fileKeys = new Set(translations.map(item => item.key));
    const missingKeys = allKeys.filter(key => !fileKeys.has(key));
    obj[fileName] = missingKeys;
    return obj;
  }, {} as Record<string, string[]>);

  return {
    allKeys,
    fileComparisons,
    flattenedFiles
  };
}
