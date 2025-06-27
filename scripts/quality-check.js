
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Executando verificações de qualidade...\n');

const commands = [
  {
    name: 'TypeScript Type Check',
    command: 'npx tsc --noEmit',
    description: 'Verificando tipos TypeScript...'
  },
  {
    name: 'ESLint',
    command: 'npx eslint . --ext .ts,.tsx --max-warnings 0',
    description: 'Verificando regras de linting...'
  },
  {
    name: 'Prettier Check',
    command: 'npx prettier --check "src/**/*.{ts,tsx,js,jsx}"',
    description: 'Verificando formatação de código...'
  }
];

let hasErrors = false;

for (const { name, command, description } of commands) {
  console.log(`📋 ${description}`);
  
  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log(`✅ ${name} passou!\n`);
  } catch (error) {
    console.log(`❌ ${name} falhou!\n`);
    hasErrors = true;
  }
}

if (hasErrors) {
  console.log('❌ Algumas verificações falharam. Corrija os problemas antes de continuar.');
  process.exit(1);
} else {
  console.log('✅ Todas as verificações passaram! Código está limpo.');
  process.exit(0);
}
