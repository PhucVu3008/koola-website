import 'dotenv/config';
import { indexLocale } from '../services/embeddingService';

(async () => {
  try {
    console.log('=== KOOLA Content Indexing ===\n');

    console.log('Indexing EN content...');
    await indexLocale('en');

    console.log('\nIndexing VI content...');
    await indexLocale('vi');

    console.log('\n=== Done! ===');
    process.exit(0);
  } catch (err) {
    console.error('Indexing failed:', err);
    process.exit(1);
  }
})();
