import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // Diretório raiz do projeto
  build: {
    outDir: '../dist', // Diretório de saída
    emptyOutDir: true, // Limpa o diretório de saída antes de construir
  },
  server: {
    port: 3000, // Porta padrão inicial
    watch: {
      usePolling: true, // Garante que as mudanças sejam detectadas
    },
    strictPort: false, // Permite que o Vite encontre outra porta disponível
    open: false, // Abre o navegador automaticamente ao iniciar
    hmr: {
      overlay: false, // Evita que o overlay de erro do Vite trave a tela
    }
  }
});
