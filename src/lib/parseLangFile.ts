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

export interface FlattendFile {
  name: string;
  translations: FlattenedPair[];
}

interface ComparisonResult {
  name: string;
  missingKeys: string[];
}

export interface FullComparisonResult {
  allKeys: string[];
  fileComparisons: ComparisonResult[];
  flattenedFiles: FlattendFile[];
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
  // First, flatten all files
  const flattenedFiles = files.map(file => ({
    name: file.name,
    translations: flattenAndSortTranslations(file.data)
  }));

  // Collect all unique keys across all files
  const allKeys = new Set<string>();
  flattenedFiles.forEach(file => {
    file.translations.forEach(item => {
      allKeys.add(item.key);
    });
  });

  // Sort all keys alphabetically
  const sortedAllKeys = Array.from(allKeys).sort();

  // Compare each file against all keys
  const fileComparisons = flattenedFiles.map(file => {
    const fileKeys = new Set(file.translations.map(item => item.key));
    const missingKeys = sortedAllKeys.filter(key => !fileKeys.has(key));

    return {
      name: file.name,
      missingKeys
    };
  });

  return {
    allKeys: sortedAllKeys,
    fileComparisons,
    flattenedFiles
  };
}
