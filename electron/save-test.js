const fs = require('fs/promises');

(async () => {
  try {
    console.log('Writing file...');
    await fs.writeFile('test_output.txt', 'Hello from test', { encoding: 'utf-8' });
    console.log('✅ File written successfully');
  } catch (err) {
    console.error('❌ Error:', err);
  }
})();
