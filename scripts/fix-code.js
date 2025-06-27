
#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔧 Corrigindo problemas de código automaticamente...\n');

const commands = [
  {
    name: 'ESLint Auto-fix',
    command: 'npx eslint . --ext .ts,.tsx --fix',
    description: 'Corrigindo problemas de linting...'
  },
  {
    name: 'Prettier Format',
    command: 'npx prettier --write "src/**/*.{ts,tsx,js,jsx}"',
    description: 'Formatando código...'
  }
];

for (const { name, command, description } of commands) {
  console.log(`🔧 ${description}`);
  
  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log(`✅ ${name} concluído!\n`);
  } catch (error) {
    console.log(`⚠️ ${name} teve alguns problemas, mas continuando...\n`);
  }
}

console.log('✅ Correções automáticas concluídas!');
console.log('💡 Execute "npm run quality-check" para verificar se ainda há problemas.');
