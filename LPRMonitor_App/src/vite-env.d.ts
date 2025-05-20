/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_IP_CAM: string
    // você pode adicionar aqui outras variáveis que você use, sempre prefixadas com VITE_
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  