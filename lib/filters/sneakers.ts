import { Product } from '@/data/products';

export const SNEAKER_SUBCATEGORY_FILTERS = [
  'Addidas Campus',
  'Addidas Samba',
  'Valentino',
  'Nike S',
  'Nike SB',
  'Nike Cortex',
  'Nike TN',
  'Nike Shox',
  'Nike Zoom',
  'New Balance',
] as const;

export const DEFAULT_SNEAKER_FILTER = SNEAKER_SUBCATEGORY_FILTERS[0];

export type SneakerFilter = (typeof SNEAKER_SUBCATEGORY_FILTERS)[number];

const normalize = (value: string | undefined) => value?.toLowerCase() ?? '';

const getSearchSource = (product: Product) => {
  return `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
};

const includesAny = (source: string, keywords: string[]) => {
  return keywords.some((keyword) => source.includes(keyword));
};

const isAddidasCampus = (product: Product) => {
  const source = getSearchSource(product);
  return (source.includes('addidas campus') || source.includes('adidas campus') || source.includes('campus')) &&
         !source.includes('samba') &&
         !source.includes('gazelle');
};

const isAddidasSamba = (product: Product) => {
  const source = getSearchSource(product);
  return source.includes('samba') || source.includes('addidas samba') || source.includes('adidas samba');
};

const isValentino = (product: Product) => {
  const source = getSearchSource(product);
  return includesAny(source, ['valentino', 'valentino']);
};

const isNikeS = (product: Product) => {
  const source = getSearchSource(product);
  return (source.includes('nike') && source.includes('s.') && !source.includes('sb')) ||
         (source.includes('nike--s') || source.includes('nike s'));
};

const isNikeSB = (product: Product) => {
  const source = getSearchSource(product);
  return includesAny(source, ['nike sb', 'nike-sb', 'nikesb', 'sb', 'dunk']);
};

const isNikeCortex = (product: Product) => {
  const source = getSearchSource(product);
  return includesAny(source, ['cortex', 'cortexnike']);
};

const isNikeTN = (product: Product) => {
  const source = getSearchSource(product);
  return (source.includes('nike') && source.includes('tn')) ||
         (source.includes('tn') && !source.includes('cortex') && !source.includes('shox') && !source.includes('zoom'));
};

const isNikeShox = (product: Product) => {
  const source = getSearchSource(product);
  return includesAny(source, ['shox', 'nike shox']);
};

const isNikeZoom = (product: Product) => {
  const source = getSearchSource(product);
  return includesAny(source, ['zoom', 'nike zoom']);
};

const isNewBalance = (product: Product) => {
  const source = getSearchSource(product);
  return includesAny(source, ['new balance', 'new-balance', 'newbalance', ' nb', 'nb ', 'nb-', 'nb530', 'nb5']);
};

export const filterSneakerProducts = (products: Product[], filter: SneakerFilter): Product[] => {
  if (filter === 'Addidas Campus') {
    return products.filter(isAddidasCampus);
  }

  if (filter === 'Addidas Samba') {
    return products.filter(isAddidasSamba);
  }

  if (filter === 'Valentino') {
    return products.filter(isValentino);
  }

  if (filter === 'Nike S') {
    return products.filter(isNikeS);
  }

  if (filter === 'Nike SB') {
    return products.filter(isNikeSB);
  }

  if (filter === 'Nike Cortex') {
    return products.filter(isNikeCortex);
  }

  if (filter === 'Nike TN') {
    return products.filter(isNikeTN);
  }

  if (filter === 'Nike Shox') {
    return products.filter(isNikeShox);
  }

  if (filter === 'Nike Zoom') {
    return products.filter(isNikeZoom);
  }

  if (filter === 'New Balance') {
    return products.filter(isNewBalance);
  }

  // Default: return empty array (should not happen with restricted filters)
  return [];
};

export const hasSneakerMatches = (products: Product[], filter: SneakerFilter): boolean => {
  return filterSneakerProducts(products, filter).length > 0;
};

