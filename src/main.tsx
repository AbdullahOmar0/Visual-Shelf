import "framer-plugin/framer.css"
import "./index.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App.tsx"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { framer } from "framer-plugin"

const queryClient = new QueryClient()

framer.showUI({
  width: 700,
  height: 500,
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
