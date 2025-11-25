// Suprimir logs verbose em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  const originalLog = console.log;
  const originalWarn = console.warn;
  
  console.log = (...args) => {
    // Filtrar logs específicos que são muito verbosos
    const message = args.join(' ');
    if (
      message.includes('use-cache: cache handlers already initialized') ||
      message.includes('using filesystem cache handler') ||
      message.includes('memory store already initialized') ||
      message.includes('__nextjs_original-stack-frame')
    ) {
      return; // Não mostrar estes logs
    }
    originalLog.apply(console, args);
  };
  
  console.warn = (...args) => {
    const message = args.join(' ');
    if (message.includes('conflicting public file')) {
      return; // Não mostrar este warning específico
    }
    originalWarn.apply(console, args);
  };
}