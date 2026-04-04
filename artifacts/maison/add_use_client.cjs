const fs = require('fs');
const path = require('path');

const explicitFiles = [
  'src/app/providers.tsx',
  'src/hooks/use-toast.ts',
  'src/hooks/use-cart.ts',
  'src/components/ui/toaster.tsx',
  'src/components/ui/sonner.tsx',
  'src/components/layout/Navbar.tsx',
  'src/components/layout/CartDrawer.tsx',
  'src/components/layout/AppLayout.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/layout/SearchOverlay.tsx',
  'src/components/layout/MobileMenu.tsx',
  'src/components/shop/ProductCard.tsx',
  'src/components/shop/ProductGrid.tsx',
  'src/components/shop/FilterSidebar.tsx',
  'src/store/cartStore.ts',
  'src/store/wishlistStore.ts',
  'src/store/uiStore.ts'
];

const patterns = [
  'useState', 'useEffect', 'useRef', 'useCallback',
  'useMemo', 'useRouter', 'usePathname', 'useSession',
  'useForm', 'useToast', 'onClick=', 'onSubmit=', 'onChange=',
  'motion\\.', 'AnimatePresence', 'useInView', 'useAnimation'
];

const regex = new RegExp(`(${patterns.join('|')})`);

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.trim().startsWith('"use client"') && !content.trim().startsWith("'use client'")) {
    fs.writeFileSync(filePath, '"use client"\n\n' + content, 'utf8');
    console.log(`Added "use client" to ${filePath}`);
  }
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      const normalizedPath = fullPath.replace(/\\/g, '/');
      const isExplicit = explicitFiles.some(f => normalizedPath.endsWith(f));
      
      if (isExplicit || regex.test(content)) {
        processFile(fullPath);
      }
    }
  }
}

explicitFiles.forEach(f => {
  const p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    processFile(p);
  }
});

processDirectory(path.join(__dirname, 'src'));
console.log('Finished processing use client');
