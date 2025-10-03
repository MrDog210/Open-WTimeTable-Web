import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SchoolCodeInputPage from "./app/pages/setup/SchoolCodeInputPage";

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <SchoolCodeInputPage />
      </main>
    </QueryClientProvider>
  );
}

export default App;
